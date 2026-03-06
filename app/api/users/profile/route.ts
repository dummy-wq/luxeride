import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import { verifyAuth } from "@/lib/auth/verify";

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash, ...userData } = user;

    return NextResponse.json({
      user: {
        id: user._id?.toString(),
        ...userData,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Prevent updating sensitive fields
    const { _id, createdAt, passwordHash, email, ...safeUpdates } = updates;

    const updatedUser = await UserModel.updateProfile(auth.userId, safeUpdates);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash: _, ...userData } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id?.toString(),
        ...userData,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
