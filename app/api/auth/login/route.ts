import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/schemas/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Schema validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }
    
    const { email, password } = validation.data;

    // Admin check
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email?.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const token = jwt.sign(
        { userId: "admin", email: "admin", role: "admin" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );

      const response = NextResponse.json(
        {
          message: "Admin Login successful",
          token,
          userId: "admin",
          user: { id: "admin", fullName: "Admin", email: "admin", role: "admin" },
        },
        { status: 200 },
      );
      response.cookies.set({
        name: "auth_token", value: token, httpOnly: true,
        secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    }

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if banned
    if (user.isBanned) {
      if (user.bannedUntil && new Date(user.bannedUntil) < new Date()) {
        // Timeout expired, automatically unban in DB
        await UserModel.toggleStatus(user._id!.toString(), false);
      } else {
        const message = user.bannedUntil
          ? `Your account is timed out until ${new Date(user.bannedUntil).toLocaleTimeString()}`
          : "Your account has been permanently banned.";
        return NextResponse.json({ error: message }, { status: 403 });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id?.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        token,
        userId: user._id?.toString(),
        user: {
          id: user._id?.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          city: user.city,
        },
      },
      { status: 200 },
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
