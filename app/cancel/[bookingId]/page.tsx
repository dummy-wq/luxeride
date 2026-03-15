"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Wallet,
    CreditCard,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";

import { Booking } from "@/lib/types";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

export default function CancelBookingPage() {
    const { refreshUser } = useAuth();
    const router = useRouter();
    const params = useParams();
    const bookingId = params.bookingId as string;
    const [booking, setBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refundChoice, setRefundChoice] = useState<"wallet" | "original" | null>(
        null
    );
    const [cancelState, setCancelState] = useState<
        "idle" | "processing" | "success" | "error"
    >("idle");

    useEffect(() => {
        fetchBooking();
    }, []);

    const fetchBooking = async () => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                router.push("/login");
                return;
            }

            // We need to find this specific booking from the user's bookings
            const response = await fetch("/api/bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to load booking details");

            const data = await response.json();
            const targetBooking = data.bookings.find(
                (b: Booking & { _id?: string }) => b.id === bookingId || b._id === bookingId
            );

            if (!targetBooking) {
                throw new Error("Booking not found. You may need to create a new booking after the database reset.");
            }

            setBooking(targetBooking);
        } catch (err: unknown) {
            console.error("Fetch booking error:", err);
            setError(err instanceof Error ? err.message : "Failed to load booking details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelConfirm = async () => {
        if (!refundChoice) return;

        setCancelState("processing");

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ refundDestination: refundChoice }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Cancellation failed");
            }

            await refreshUser();
            setCancelState("success");
            setTimeout(() => router.push("/profile"), 2500);
        } catch (err: unknown) {
            console.error(err);
            setCancelState("error");
            setError(err instanceof Error ? err.message : "An unknown error occurred during cancellation.");
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navigation />
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </main>
        );
    }

    if (error && cancelState === "idle") {
        return (
            <main className="min-h-screen bg-background">
                <Navigation />
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="p-8 text-center max-w-md space-y-4">
                        <XCircle className="w-12 h-12 text-destructive mx-auto" />
                        <p className="text-lg font-bold">Error</p>
                        <p className="text-muted-foreground">{error}</p>
                        <Button onClick={() => router.push("/profile")} variant="outline">
                            Return to Profile
                        </Button>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-16">
            <Navigation />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/profile")}
                    className="text-muted-foreground hover:text-foreground p-0 h-auto"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
                </Button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <XCircle className="w-8 h-8 text-destructive" />
                        Cancel Booking
                    </h1>
                    <p className="text-muted-foreground">
                        Please review the cancellation details and select your refund preference.
                    </p>
                </div>

                {/* Booking Details */}
                {booking && (
                    <Card className="p-6 bg-card border-border">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                            Booking Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vehicle</span>
                                <span className="font-semibold text-foreground">{booking.carName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className="font-bold text-primary">{formatPrice(booking.totalCost)}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 text-destructive text-sm items-start">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>
                                Cancelling this booking is permanent. The associated QR code will be voided instantly.
                            </p>
                        </div>
                    </Card>
                )}

                {/* Refund Options */}
                {cancelState === "idle" && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-foreground">
                            Select Refund Destination
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                                className={`p-6 cursor-pointer border-2 transition-all ${refundChoice === "wallet"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                onClick={() => setRefundChoice("wallet")}
                            >
                                <Wallet className={`w-8 h-8 mb-4 ${refundChoice === "wallet" ? "text-primary" : "text-muted-foreground"}`} />
                                <h4 className="font-bold text-foreground">{siteConfig.ui.walletName} Wallet</h4>
                                <p className="text-sm text-green-500 font-semibold mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Instant Refund
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Money is added to your secure {siteConfig.brand.name} wallet instantly and can be used for future bookings.
                                </p>
                            </Card>

                            <Card
                                className={`p-6 cursor-pointer border-2 transition-all ${refundChoice === "original"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                onClick={() => setRefundChoice("original")}
                            >
                                <CreditCard className={`w-8 h-8 mb-4 ${refundChoice === "original" ? "text-primary" : "text-muted-foreground"}`} />
                                <h4 className="font-bold text-foreground">Original Method</h4>
                                <p className="text-sm text-amber-500 font-semibold mt-1">
                                    3-5 Working Days
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Refunded back to the original credit card, UPI, or bank account used during checkout.
                                </p>
                            </Card>
                        </div>

                        <Button
                            className="w-full py-6 text-lg font-bold mt-8 bg-destructive hover:bg-destructive/90"
                            disabled={!refundChoice}
                            onClick={handleCancelConfirm}
                        >
                            Confirm Cancellation & Refund to {refundChoice === "wallet" ? "Wallet" : refundChoice === "original" ? "Original Source" : "..."}
                        </Button>
                    </div>
                )}

                {/* Processing State */}
                {cancelState === "processing" && (
                    <Card className="p-12 text-center space-y-4 border-primary/20 bg-card">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                        <h3 className="text-xl font-bold">Processing Cancellation...</h3>
                        <p className="text-muted-foreground">Voiding booking and initiating refund.</p>
                    </Card>
                )}

                {/* Success State */}
                {cancelState === "success" && (
                    <Card className="p-12 text-center space-y-4 border-green-500/20 bg-green-500/5">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-2xl font-bold text-foreground">Booking Cancelled</h3>
                        <p className="text-muted-foreground">
                            {refundChoice === "wallet"
                                ? `${formatPrice(booking?.totalCost)} has been added to your {siteConfig.ui.walletName} Wallet instantly.`
                                : `${formatPrice(booking?.totalCost)} refund initiated to your original payment method. Please allow 3-5 days.`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">Returning to profile...</p>
                    </Card>
                )}

            </div>
        </main>
    );
}
