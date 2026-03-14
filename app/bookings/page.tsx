"use client";

import { useState, useEffect } from "react";
import { Zap, CheckCircle2, History, Loader2, Navigation as NavIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Booking } from "@/lib/types";
import { cars } from "@/lib/data/cars";

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setIsDataLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) return;

      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (authLoading || (user && isDataLoading)) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Retrieving your fleet details...
          </p>
        </div>
      </main>
    );
  }

  if (!user && !authLoading) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const activeBookings = bookings.filter(b => b.status === "confirmed");
  const pastBookings = bookings.filter(b => b.status !== "confirmed");

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">MY BOOKINGS</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage your active reservations and review your rental history
            </p>
          </div>

          {activeBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Active Fleet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="p-5 bg-card border-primary/20 border-2 relative overflow-hidden group hover:shadow-xl transition-all"
                  >
                    {/* Car Image */}
                    {(() => {
                      const imgSrc = booking.carImage || cars.find(c => c.id === booking.carId)?.image;
                      return imgSrc ? (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-muted">
                          <Image
                            src={imgSrc}
                            alt={booking.carName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null;
                    })()}
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-white p-2 rounded-xl flex-shrink-0 shadow-inner">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.qrCode || "LUXE-VOID"}`}
                          alt="Booking QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-xl font-black text-foreground leading-tight line-clamp-2">
                          {booking.carName}
                        </p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 inline-block px-2 py-0.5 rounded">
                          {booking.status}
                        </p>
                        <div className="mt-2 text-xs font-mono font-medium text-foreground p-2 bg-secondary rounded-lg block w-full text-center">
                          <CountdownTimer expireAt={booking.expireAt as string} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pickup</span>
                        <span className="text-sm font-semibold">{new Date(booking.startDate).toLocaleDateString()}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => router.push(`/cancel/${booking.id}`)}
                        className="font-bold text-xs"
                      >
                        CANCEL
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div className="space-y-4 pt-8">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <History className="w-6 h-6 text-muted-foreground" />
                Past Rentals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id} className="p-4 bg-card border-border border flex flex-col justify-between">
                    <div>
                      {(() => {
                        const imgSrc = booking.carImage || cars.find(c => c.id === booking.carId)?.image;
                        return imgSrc ? (
                          <div className="relative w-full h-24 rounded-md overflow-hidden mb-3 opacity-60 grayscale group-hover:grayscale-0 transition-all">
                            <Image src={imgSrc} alt={booking.carName} fill className="object-cover" />
                          </div>
                        ) : null;
                      })()}
                      <h4 className="font-bold text-foreground">{booking.carName}</h4>
                      <div className="flex justify-between mt-1 items-center">
                        <span className="text-xs text-muted-foreground">{new Date(booking.startDate).toLocaleDateString()}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${booking.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {bookings.length === 0 && !isDataLoading && (
            <div className="py-20 text-center space-y-6 bg-card border border-dashed border-border rounded-xl">
              <NavIcon className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-foreground">No bookings found</h3>
                <p className="text-muted-foreground mt-1 text-sm">You haven't rented any vehicles yet.</p>
              </div>
              <Link href="/cars">
                <Button className="font-bold">Explore Our Fleet</Button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
