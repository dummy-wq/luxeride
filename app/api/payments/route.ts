import { NextRequest, NextResponse } from "next/server";
import { PaymentModel } from "@/lib/db/models/payment";
import { verifyAuth } from "@/lib/auth/verify";

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await PaymentModel.findByUserId(auth.userId);

    return NextResponse.json({
      payments: payments.map((payment) => ({
        id: payment._id?.toString(),
        ...payment,
      })),
    });
  } catch (error) {
    console.error("Fetch payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
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

    const paymentData = await request.json();
    const { status, ...rest } = paymentData;

    const paymentId = await PaymentModel.create({
      userId: auth.userId,
      ...rest,
      status: status || "completed",
    });

    return NextResponse.json(
      {
        message: "Payment created successfully",
        paymentId: paymentId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
