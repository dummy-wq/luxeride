import { NextRequest, NextResponse } from "next/server";
import { BookingModel } from "@/lib/db/models/booking";
import { verifyAuth } from "@/lib/auth/verify";

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await BookingModel.findByUserId(auth.userId);

    return NextResponse.json({
      bookings: bookings.map((booking) => ({
        id: booking._id?.toString(),
        ...booking,
      })),
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingData = await request.json();
    const { selectedDays, endDate, ...rest } = bookingData;

    // Generate a simple QR code data string
    const qrCode = `LUXE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;

    // Set expiry to 1 hour after the end date/last selected day
    const expiryDate =
      selectedDays && selectedDays.length > 0
        ? new Date(
            new Date(selectedDays[selectedDays.length - 1]).getTime() +
              60 * 60 * 1000,
          )
        : new Date(new Date(endDate).getTime() + 60 * 60 * 1000);

    const bookingId = await BookingModel.create({
      userId: auth.userId,
      ...rest,
      selectedDays,
      endDate: new Date(endDate),
      qrCode,
      expireAt: expiryDate,
      status: "confirmed", // Auto-confirming for trial flow
    });

    return NextResponse.json(
      {
        message: "Booking created successfully",
        bookingId: bookingId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
