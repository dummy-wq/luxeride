"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Fuel,
  Gauge,
  Users,
  Zap,
  Shield,
  Droplet,
  Navigation as NavIcon,
  CheckCircle2,
  Loader2,
  Heart,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { INDIAN_CITIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

import { carsDatabase } from "@/lib/data/cars";

export default function CarDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;
  const car =
    carsDatabase[id as keyof typeof carsDatabase] || carsDatabase["1"];
  const [bookingType, setBookingType] = useState<"hourly" | "subscription">(
    "hourly",
  );
  const [hours, setHours] = useState(12);
  const [subscriptionDays, setSubscriptionDays] = useState(7);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, updateUser } = useAuth();
  const isAuthenticated = !!user;
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "success" | "error" | string
  >("idle");

  const defaultCost =
    bookingType === "hourly"
      ? car.price * hours
      : car.price * 10 * subscriptionDays * 0.5; // Subscription has special discounted daily rate

  const tax = Math.round(defaultCost * 0.18);
  const totalCost = Math.round(defaultCost + tax);

  useEffect(() => {
    if (user) {
      if (user.city && selectedCity === "Mumbai") setSelectedCity(user.city);
      if (user.address && !address) setAddress(user.address);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.licenseNumber && !licenseNumber) setLicenseNumber(user.licenseNumber);
    }
  }, [user]);



  const handleBookNow = async () => {
    if (!isAuthenticated) {
      router.push("/signup?redirect=/cars/" + id);
      return;
    }

    const missingDetails = !user.phone || !user.licenseNumber || !user.address || !user.city;

    if (missingDetails) {
      if (!phone.trim() || !licenseNumber.trim() || !address.trim() || !selectedCity.trim()) {
        toast({
          title: "Incomplete Details",
          description: "Please fill in all required details before proceeding.",
          variant: "destructive",
        });
        return;
      }
      
      setIsProfileUpdating(true);
      setProfileUpdateError("");
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            city: selectedCity,
            address,
            phone,
            licenseNumber,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          updateUser(data.user);
        } else {
          const err = await response.json();
          setProfileUpdateError(err.error || "Failed to save details");
          setIsProfileUpdating(false);
          return;
        }
      } catch (err) {
        setProfileUpdateError("Network error occurred while saving profile.");
        setIsProfileUpdating(false);
        return;
      } finally {
        setIsProfileUpdating(false);
      }
    }

    setIsVerifying(true);
    setIsBooking(true);

    // Compute city-seeded availability check (must match CarsShowcase logic)
    const city = (user?.city || selectedCity || "").toLowerCase();
    let cityHash = 0;
    for (let i = 0; i < city.length; i++) {
      cityHash = ((cityHash << 5) - cityHash + city.charCodeAt(i)) | 0;
    }
    cityHash = Math.abs(cityHash);

    const getCycle = () => Math.floor(Date.now() / (12 * 60 * 60 * 1000));
    const cycle = getCycle();
    const carIdNum = parseInt(id);

    // Shaded logic: (carId * 13 + cycle * 7 + cityHash) % 7 === 0
    const isShaded = (carIdNum * 13 + cycle * 7 + cityHash) % 7 === 0;

    // Availability state logic: states[(carId * 3 + cycle + cityHash) % states.length]
    const states = ["Available", "Available", "Booked", "Maintenance"];
    const availabilityState = states[(carIdNum * 3 + cycle + cityHash) % states.length];

    // Synthetic delay to "verify availability"
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isShaded || availabilityState !== "Available") {
      setIsVerifying(false);
      setIsBooking(false);
      setBookingStatus(
        `This vehicle is currently ${availabilityState === "Available" ? "Reserved" : availabilityState} in ${city.charAt(0).toUpperCase() + city.slice(1)}. Please choose another car.`
      );
      return;
    }

    setIsVerifying(false);

    try {
      const startDate = new Date().toISOString();
      const endDate = new Date(
        Date.now() +
        (bookingType === "hourly"
          ? hours * 60 * 60 * 1000
          : subscriptionDays * 24 * 60 * 60 * 1000),
      ).toISOString();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          carId: car.id,
          carName: car.name,
          carPrice: car.price,
          startDate,
          endDate,
          selectedDays: null,
          numberOfDays:
            bookingType === "hourly" ? hours / 24 : subscriptionDays,
          totalCost: totalCost,
          pickupLocation: `${selectedCity} - ${address}`,
          dropoffLocation: `${selectedCity} - ${address}`,
        }),
      });

      if (response.ok) {
        const bookingResult = await response.json();
        setBookingStatus("success");

        // Store payment details for the payment page
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            bookingId: bookingResult.bookingId,
            carName: car.name,
            totalCost: totalCost,
            baseCost: defaultCost,
            tax: tax,
            duration:
              bookingType === "hourly"
                ? `${hours} hours`
                : `${subscriptionDays} days`,
            location: `${selectedCity} - ${address}`,
          })
        );

        setTimeout(
          () => router.push(`/payment/${bookingResult.bookingId}`),
          1500
        );
      } else {
        setBookingStatus(
          "Connection failed. Ensure the server and database are running."
        );
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStatus(
        "Network error. Ensure the server and database are running."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/cars"
            className="text-primary hover:text-primary/80 font-semibold mb-6 inline-block transition-colors"
          >
            ← Back to All Cars
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <Card className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border-border overflow-hidden relative">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover"
                  priority
                />
              </Card>

              {/* Title and Category */}
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-semibold text-primary">
                  {car.category}
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  {car.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Model {car.model}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-card border-border text-center">
                  <Fuel className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-bold text-foreground">{car.mileage}</p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Seats</p>
                  <p className="font-bold text-foreground">{car.seats}</p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <Gauge className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Transmission</p>
                  <p className="font-bold text-foreground">
                    {car.transmission}
                  </p>
                </Card>
                <Card className="p-4 bg-card border-border text-center">
                  <Droplet className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-bold text-foreground">{car.fuel}</p>
                </Card>
              </div>

              {/* Performance Specs */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Performance
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Engine</p>
                    <p className="font-semibold text-foreground">
                      {car.engine}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Power</p>
                    <p className="font-semibold text-foreground">{car.power}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Torque</p>
                    <p className="font-semibold text-foreground">
                      {car.torque}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      0-100 km/h
                    </p>
                    <p className="font-semibold text-foreground">
                      {car.acceleration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Top Speed
                    </p>
                    <p className="font-semibold text-foreground">
                      {car.topSpeed}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Premium Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Policies */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Rental Policies
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Insurance</p>
                      <p className="text-sm text-muted-foreground">
                        {car.insurance}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Cancellation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {car.cancellation}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="p-6 bg-gradient-to-b from-card to-card border-border space-y-6">
                  <div className="flex justify-between items-center bg-card">
                    <h3 className="text-xl font-bold">Booking Summary</h3>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 bg-background/50 rounded-full hover:bg-secondary transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </div>
                  {/* User Context */}
                  {user && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase">
                        Booking as
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        ₹{car.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/hr</span>
                    </div>
                  </div>

                  {/* Booking Type */}
                  <div className="flex bg-secondary rounded-lg p-1">
                    <button
                      onClick={() => setBookingType("hourly")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${bookingType === "hourly" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Hourly Rental
                    </button>
                    <button
                      onClick={() => setBookingType("subscription")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${bookingType === "subscription" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Subscription
                    </button>
                  </div>

                  {/* Selection */}
                  <div className="space-y-4">
                    {bookingType === "hourly" ? (
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">
                          Hours
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={hours}
                          onChange={(e) => setHours(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">
                          Subscription Days (Min 7)
                        </label>
                        <input
                          type="number"
                          min="7"
                          value={subscriptionDays}
                          onChange={(e) =>
                            setSubscriptionDays(
                              Math.max(7, Number(e.target.value)),
                            )
                          }
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-xs text-green-500 mt-2">
                          Special discounted rate applied!
                        </p>
                      </div>
                    )}

                    {/* City Selection */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" /> Delivery City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {INDIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address Prompt */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Delivery Address
                      </label>
                      <textarea
                        placeholder="Street name, landmark, etc."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {bookingType === "hourly"
                          ? `${hours} hours`
                          : `${subscriptionDays} days`}
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{defaultCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Taxes & Fees (18%)
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{tax.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{totalCost.toLocaleString()}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleBookNow}
                        disabled={isBooking || bookingStatus === "success"}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg transition-all active:scale-[0.98] relative overflow-hidden"
                      >
                        {isVerifying ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying availability...
                          </span>
                        ) : isBooking ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isProfileUpdating ? "Saving details..." : "Processing..."}
                          </span>
                        ) : bookingStatus === "success" ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Booked!
                          </span>
                        ) : (
                          isAuthenticated && (!user.phone || !user.licenseNumber || !user.address || !user.city) ? "Save requirements and book" : "Book Now"
                        )}
                      </Button>

                      {bookingStatus !== "idle" &&
                        bookingStatus !== "success" && (
                          <p className="text-xs text-red-500 text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                            {bookingStatus === "error"
                              ? "Booking failed. Please try again."
                              : bookingStatus}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-xs text-muted-foreground text-center">
                    <p>✓ Free Cancellation up to 24 hours</p>
                    <p>✓ 24/7 Customer Support</p>
                    <p>✓ Comprehensive Insurance</p>
                  </div>
                </Card>

                {isAuthenticated && (!user.phone || !user.licenseNumber || !user.address || !user.city) && (
                  <Card className="p-6 bg-primary/10 border border-primary/20 space-y-4 rounded-xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <h3 className="text-lg">Required Details</h3>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      For your safety and a seamless booking process, please complete your profile details below.
                    </p>
                    
                    {profileUpdateError && (
                      <p className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">{profileUpdateError}</p>
                    )}

                    <div className="space-y-3 pt-2">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Phone Number (+91...)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Driver's License Number"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground italic">City and Address from the summary below will also be saved.</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
