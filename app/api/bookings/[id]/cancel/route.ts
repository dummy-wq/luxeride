import { NextRequest, NextResponse } from "next/server";
import { BookingModel } from "@/lib/db/models/booking";
import { PaymentModel } from "@/lib/db/models/payment";
import { UserModel } from "@/lib/db/models/user";
import { verifyAuth } from "@/lib/auth/verify";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { refundDestination } = await request.json();

        // Validate refund destination
        if (!["wallet", "original"].includes(refundDestination)) {
            return NextResponse.json(
                { error: "Invalid refund destination" },
                { status: 400 }
            );
        }

        const { id } = await params;

        // 1. Fetch the booking
        const booking = await BookingModel.findById(id);
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Verify ownership
        if (booking.userId.toString() !== auth.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (booking.status === "cancelled") {
            return NextResponse.json(
                { error: "Booking is already cancelled" },
                { status: 400 }
            );
        }

        // 2. Fetch the associated payment to know the refund amount
        const payment = await PaymentModel.findByBookingId(id);
        if (!payment) {
            return NextResponse.json(
                { error: "Original payment not found" },
                { status: 404 }
            );
        }

        // 3. Update the booking status
        await BookingModel.updateBooking(id, {
            status: "cancelled",
            cancellationDate: new Date(),
        } as any);

        // 4. Process the refund based on user choice
        if (refundDestination === "wallet") {
            // Add funds to LuxeCash wallet
            await UserModel.addLuxeCash(auth.userId, payment.amount);

            // Update payment status
            await PaymentModel.updateStatus(payment._id!.toString(), "refunded_to_wallet");

            return NextResponse.json({
                message: "Booking cancelled and refunded to LuxeCash instantly.",
                refundAmount: payment.amount,
                destination: "wallet",
            });
        } else {
            // External refund process (Simulated)
            await PaymentModel.updateStatus(payment._id!.toString(), "refunded");

            return NextResponse.json({
                message: "Booking cancelled. Refund initiated to original payment method.",
                refundAmount: payment.amount,
                destination: "original",
                estimatedDays: "3-5",
            });
        }
    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: "Failed to process cancellation" },
            { status: 500 }
        );
    }
}
