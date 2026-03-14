"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Users, Heart, Search, Shield, Zap, Droplet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { siteConfig } from "@/lib/config";

import { cars, carsDatabase } from "@/lib/data/cars";

export function CarsShowcase() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cityHash, setCityHash] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  // Price range
  const allPrices = useMemo(() => cars.map((c) => c.pricePerHour), []);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  // Read user's city on mount and compute a numeric hash for seeding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateHash = () => {
        try {
          setIsLoading(true);
          const stored = localStorage.getItem("user");
          if (stored) {
            const usr = JSON.parse(stored);
            const city = (usr.city || "").toLowerCase();
            if (city) {
              let hash = 0;
              for (let i = 0; i < city.length; i++) {
                hash = ((hash << 5) - hash + city.charCodeAt(i)) | 0;
              }
              setCityHash(Math.abs(hash));
              setTimeout(() => setIsLoading(false), 800);
              return;
            }
          }
          setCityHash(0);
          setTimeout(() => setIsLoading(false), 800);
        } catch {
          setCityHash(0);
          setIsLoading(false);
        }
      };

      updateHash();
      window.addEventListener("storage", updateHash);
      return () => window.removeEventListener("storage", updateHash);
    }
  }, []);

  // Pre-fill user profile fields when detail opens
  useEffect(() => {
    if (user && selectedCarId) {
      // no-op: simplified detail panel no longer pre-fills form fields
    }
  }, [user, selectedCarId]);

  // Handle Incremental Navigation (URL ?car=id sync)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const carId = params.get("car");
      if (carId && carsDatabase[carId as keyof typeof carsDatabase]) {
        setSelectedCarId(carId);
      } else {
        setSelectedCarId(null);
      }
    };

    // Initialize from URL on mount
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 12-hour time cycle for periodic rotation
  const getCycle = () => Math.floor(Date.now() / (12 * 60 * 60 * 1000));

  const isShadedOut = (carId: number) => {
    const cycle = getCycle();
    return (carId * 13 + cycle * 7 + cityHash) % 7 === 0;
  };

  const getAvailability = (carId: number) => {
    const cycle = getCycle();
    const states = ["Available", "Available", "Booked", "Maintenance"];
    return states[(carId * 3 + cycle + cityHash) % states.length];
  };

  const toggleFavorite = (e: React.MouseEvent, carId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  const { carsPage } = siteConfig;

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesCategory =
        selectedCategory === "all" || car.category === selectedCategory;
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        car.pricePerHour >= priceRange[0] && car.pricePerHour <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchQuery, priceRange]);

  // Get detailed car from carsDatabase (for the inline detail panel)
  const selectedCar = selectedCarId
    ? carsDatabase[selectedCarId as keyof typeof carsDatabase]
    : null;

  // Handle URL syncing for incremental navigation
  const openCarDetail = (carId: string | null) => {
    setSelectedCarId(carId);
    const url = new URL(window.location.href);
    if (carId) {
      url.searchParams.set("car", carId);
    } else {
      url.searchParams.delete("car");
    }
    // Push state so browser Back button works to close the panel!
    window.history.pushState({ car: carId }, "", url.toString());
  };

  // ── Booking handler removed — users go to /cars/[id] for booking ──

  // ── Card animation variants ──
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <section id="cars" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {carsPage.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {carsPage.subheading}
          </p>
        </div>

        {/* Filters Bar — hidden when detail is open */}
        {!selectedCarId && (
          <div className="flex flex-col gap-6 mb-12">
            {/* Category + Search Row */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center">
                {carsPage.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-secondary text-foreground hover:bg-muted"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={carsPage.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                Price Range:
              </span>
              <div className="flex-1 w-full sm:max-w-md">
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                ₹{priceRange[0]} — ₹{priceRange[1]}/hr
              </span>
            </div>
          </div>
        )}

        {/* ── Inline Detail Panel ── */}
        <AnimatePresence mode="wait">
          {selectedCar && selectedCarId && (
            <motion.div
              key={`detail-${selectedCarId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="mb-12"
            >
              <button
                onClick={() => openCarDetail(null)}
                className="text-primary hover:text-primary/80 font-semibold mb-6 inline-flex items-center gap-1 transition-colors"
              >
                ← Back to All Cars
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Hero Image */}
                  <Card className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border-border overflow-hidden relative">
                    <Image
                      src={selectedCar.image}
                      alt={selectedCar.name}
                      fill
                      className={`object-cover ${selectedCar.name === "Jaguar XE" ? "scale-x-[-1]" : ""}`}
                      priority
                    />
                  </Card>

                  {/* Title and Category */}
                  <div className="space-y-2">
                    <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-semibold text-primary">
                      {selectedCar.category}
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">
                      {selectedCar.name}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Model {selectedCar.model}
                    </p>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-card border-border text-center">
                      <Fuel className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-bold text-foreground">
                        {selectedCar.mileage}
                      </p>
                    </Card>
                    <Card className="p-4 bg-card border-border text-center">
                      <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-bold text-foreground">
                        {selectedCar.seats}
                      </p>
                    </Card>
                    <Card className="p-4 bg-card border-border text-center">
                      <Gauge className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Transmission
                      </p>
                      <p className="font-bold text-foreground">
                        {selectedCar.transmission}
                      </p>
                    </Card>
                    <Card className="p-4 bg-card border-border text-center">
                      <Droplet className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-bold text-foreground">
                        {selectedCar.fuel}
                      </p>
                    </Card>
                  </div>

                  {/* Performance Specs */}
                  <Card className="p-6 bg-card border-border space-y-4">
                    <h3 className="text-xl font-bold text-foreground">
                      Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Engine
                        </p>
                        <p className="font-semibold text-foreground">
                          {selectedCar.engine}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Power
                        </p>
                        <p className="font-semibold text-foreground">
                          {selectedCar.power}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Torque
                        </p>
                        <p className="font-semibold text-foreground">
                          {selectedCar.torque}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          0-100 km/h
                        </p>
                        <p className="font-semibold text-foreground">
                          {selectedCar.acceleration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Top Speed
                        </p>
                        <p className="font-semibold text-foreground">
                          {selectedCar.topSpeed}
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
                      {selectedCar.features.map(
                        (feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-foreground">{feature}</span>
                          </div>
                        ),
                      )}
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
                          <p className="font-semibold text-foreground">
                            Insurance
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedCar.insurance}
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
                            {selectedCar.cancellation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ── Booking Sidebar ── */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Card className="p-6 bg-card border-border space-y-6">
                      <h3 className="text-xl font-bold text-foreground">Quick Summary</h3>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">
                            ₹{selectedCar.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">/hr</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>✓ {siteConfig.booking.freeCancellation}</p>
                        <p>✓ {siteConfig.booking.support}</p>
                        <p>✓ {siteConfig.booking.insurance}</p>
                      </div>

                      <Button
                        onClick={() => router.push(`/cars/${selectedCarId}`)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg transition-all active:scale-[0.98]"
                      >
                        Book Now
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Cars Grid ── */}
        {!selectedCarId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Card
                      key={`skeleton-${i}`}
                      className="overflow-hidden bg-card border-border p-0 space-y-4"
                    >
                      <Skeleton className="h-48 w-full" />
                      <div className="p-5 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </Card>
                  ))
                : filteredCars.length > 0
                  ? filteredCars.map((car) => {
                      const availability = getAvailability(car.id);
                      const shaded =
                        isShadedOut(car.id) || availability !== "Available";
                      const hasDetail =
                        carsDatabase[
                          String(car.id) as keyof typeof carsDatabase
                        ];

                      return (
                        <motion.div
                          key={car.id}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                            mass: 0.8,
                          }}
                        >
                          <Card
                            className={`group overflow-hidden hover:shadow-lg transition-all duration-150 hover:-translate-y-1 bg-card border-border relative h-full ${shaded ? "grayscale opacity-60" : ""}`}
                          >
                            {/* Availability Badge */}
                            <div
                              className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                                availability === "Available"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : availability === "Booked"
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {availability}
                            </div>

                            {/* Car Image */}
                            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden group">
                              <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105">
                                <Image
                                  src={car.image}
                                  alt={car.name}
                                  fill
                                  className={`object-cover ${car.name === "Jaguar XE" ? "scale-x-[-1]" : ""}`}
                                />
                              </div>
                              {shaded && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                                  <span className="text-white font-black text-xs uppercase tracking-tighter border-2 border-white/50 px-3 py-1 rotate-12">
                                    {availability === "Available"
                                      ? "Reservation Required"
                                      : availability}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={(e) => toggleFavorite(e, car.id)}
                                className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-background transition-all hover:scale-110 z-10"
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </button>
                            </div>

                            {/* Car Info */}
                            <div className="p-5 space-y-4">
                              <div>
                                <h3 className="font-bold text-lg text-foreground">
                                  {car.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {car.category}
                                </p>
                              </div>

                              {/* Specs */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Fuel className="w-4 h-4 text-primary" />
                                  <span>
                                    {car.mileage} • {car.fuel}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Gauge className="w-4 h-4 text-primary" />
                                  <span>{car.transmission}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="w-4 h-4 text-primary" />
                                  <span>{car.seats} Seats</span>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="pt-2 border-t border-border">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-primary">
                                    {car.price}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    /hr
                                  </span>
                                </div>
                              </div>

                              {/* CTA */}
                              {hasDetail && !shaded ? (
                                <Button
                                  onClick={() =>
                                    openCarDetail(String(car.id))
                                  }
                                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                                >
                                  View Details
                                </Button>
                              ) : (
                                <Button
                                  disabled={shaded || !hasDetail}
                                  className={`w-full transition-all ${
                                    shaded || !hasDetail
                                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                  }`}
                                >
                                  {shaded ? "Unavailable" : "View Details"}
                                </Button>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })
                  : null}
            </AnimatePresence>

            {/* No results */}
            {!isLoading && filteredCars.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-muted/20 rounded-2xl border border-dashed border-border">
                <Search className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
                <div className="space-y-1">
                  <p className="text-xl font-bold text-foreground">
                    {carsPage.noResultsTitle}
                  </p>
                  <p className="text-muted-foreground">
                    {carsPage.noResultsSubtitle}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([minPrice, maxPrice]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Stats Section */}
        {!selectedCarId && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border">
            {carsPage.stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
