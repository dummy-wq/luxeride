"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CreditCard,
    Wallet,
    Smartphone,
    Banknote,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    Car,
} from "lucide-react";

const PAYMENT_METHODS = [
    { id: "card" as const, label: "Credit / Debit Card", icon: CreditCard },
    { id: "upi" as const, label: "UPI", icon: Smartphone },
    { id: "wallet" as const, label: "Wallet", icon: Wallet },
    { id: "cash" as const, label: "Cash on Delivery", icon: Banknote },
];

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.bookingId as string;
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<
        "card" | "upi" | "wallet" | "cash"
    >("card");
    const [paymentState, setPaymentState] = useState<
        "idle" | "processing" | "success" | "error"
    >("idle");
    const [progressText, setProgressText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Read booking details from sessionStorage (set by the car detail page)
        const stored = sessionStorage.getItem("pendingPayment");
        if (stored) {
            setBookingDetails(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const handlePay = async () => {
        if (!bookingDetails) return;

        setPaymentState("processing");

        // Step 1: Initializing
        setProgressText("Initializing payment...");
        await new Promise((r) => setTimeout(r, 800));

        // Step 2: Verifying
        setProgressText("Verifying payment details...");
        await new Promise((r) => setTimeout(r, 1000));

        // Step 3: Processing
        setProgressText("Processing transaction...");
        await new Promise((r) => setTimeout(r, 1200));

        // Step 4: Actually create the payment record
        setProgressText("Confirming payment...");
        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    amount: bookingDetails.totalCost,
                    currency: "INR",
                    paymentMethod: selectedMethod,
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    carName: bookingDetails.carName,
                    notes: `Payment for ${bookingDetails.carName} rental`,
                }),
            });

            if (!response.ok) {
                throw new Error("Payment API failed");
            }

            await new Promise((r) => setTimeout(r, 500));
            setPaymentState("success");
            setProgressText("Payment successful!");

            // Clean up and redirect to profile after showing success
            sessionStorage.removeItem("pendingPayment");
            setTimeout(() => router.push("/profile"), 2000);
        } catch (error) {
            console.error("Payment error:", error);
            setPaymentState("error");
            setProgressText("Payment failed. Please try again.");
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

    if (!bookingDetails) {
        return (
            <main className="min-h-screen bg-background">
                <Navigation />
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="p-8 text-center max-w-md space-y-4">
                        <p className="text-muted-foreground">
                            No booking found. Please book a car first.
                        </p>
                        <Button onClick={() => router.push("/cars")}>Browse Cars</Button>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">
                            Complete Payment
                        </h1>
                        <p className="text-muted-foreground">
                            Confirm your booking by completing the payment
                        </p>
                    </div>

                    {/* Booking Summary Card */}
                    <Card className="p-6 bg-card border-border space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground">
                                    {bookingDetails.carName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {bookingDetails.location}
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="text-foreground font-medium">
                                    {bookingDetails.duration}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Base Cost</span>
                                <span className="text-foreground font-medium">
                                    ₹{bookingDetails.baseCost?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Taxes & Fees (18%)
                                </span>
                                <span className="text-foreground font-medium">
                                    ₹{bookingDetails.tax?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border">
                                <span className="font-bold text-foreground">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    ₹{bookingDetails.totalCost?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Method Selection */}
                    {paymentState === "idle" && (
                        <Card className="p-6 bg-card border-border space-y-4">
                            <h3 className="font-bold text-foreground">Payment Method</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${selectedMethod === method.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/30"
                                                }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 mb-2 ${selectedMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
                                            />
                                            <p
                                                className={`text-sm font-semibold ${selectedMethod === method.id ? "text-primary" : "text-foreground"}`}
                                            >
                                                {method.label}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Pay Button / Processing State */}
                    {paymentState === "idle" && (
                        <Button
                            onClick={handlePay}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-bold text-lg transition-all active:scale-[0.98]"
                        >
                            Pay ₹{bookingDetails.totalCost?.toLocaleString()}
                        </Button>
                    )}

                    {paymentState === "processing" && (
                        <Card className="p-8 bg-card border-border text-center space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                            <p className="text-foreground font-semibold">{progressText}</p>
                            <p className="text-xs text-muted-foreground">
                                Please do not close this page
                            </p>
                        </Card>
                    )}

                    {paymentState === "success" && (
                        <Card className="p-8 bg-card border-primary/20 border-2 text-center space-y-4">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                            <div>
                                <p className="text-xl font-bold text-foreground">
                                    Payment Successful!
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    ₹{bookingDetails.totalCost?.toLocaleString()} paid via{" "}
                                    {selectedMethod.toUpperCase()}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Redirecting to your profile...
                            </p>
                        </Card>
                    )}

                    {paymentState === "error" && (
                        <Card className="p-8 bg-card border-destructive/20 border-2 text-center space-y-4">
                            <p className="text-lg font-bold text-destructive">
                                Payment Failed
                            </p>
                            <p className="text-sm text-muted-foreground">{progressText}</p>
                            <Button
                                onClick={() => setPaymentState("idle")}
                                variant="outline"
                                className="border-border"
                            >
                                Try Again
                            </Button>
                        </Card>
                    )}

                    {/* Security Footer */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Secured by LuxeRide • 256-bit encryption</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
