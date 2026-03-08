"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Users, Heart, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import Image from "next/image";

import { cars } from "@/lib/data/cars";

export function CarsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cityHash, setCityHash] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Read user's city on mount and compute a numeric hash for seeding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateHash = () => {
        try {
          setIsLoading(true);
          const stored = localStorage.getItem("user");
          if (stored) {
            const user = JSON.parse(stored);
            const city = (user.city || "").toLowerCase();
            if (city) {
              let hash = 0;
              for (let i = 0; i < city.length; i++) {
                hash = ((hash << 5) - hash + city.charCodeAt(i)) | 0;
              }
              setCityHash(Math.abs(hash));
              setTimeout(() => setIsLoading(false), 800); // Small delay for effect
              return;
            }
          }
          setCityHash(0); // Default if no city
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

  // 12-hour time cycle for periodic rotation
  const getCycle = () => Math.floor(Date.now() / (12 * 60 * 60 * 1000));

  const isShadedOut = (carId: number) => {
    const cycle = getCycle();
    // City-seeded: different cities shade different cars
    return (carId * 13 + cycle * 7 + cityHash) % 7 === 0; // ~14% cars shaded
  };

  const getAvailability = (carId: number) => {
    const cycle = getCycle();
    const states = ["Available", "Available", "Booked", "Maintenance"];
    // City-seeded: different cities have different availability patterns
    return states[(carId * 3 + cycle + cityHash) % states.length];
  };

  const toggleFavorite = (e: React.MouseEvent, carId: number) => {
    e.preventDefault();
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  const categories = [
    { id: "all", label: "All Vehicles" },
    { id: "SUV", label: "SUV" },
    { id: "Sedan", label: "Sedan" },
    { id: "Hatchback", label: "Hatchback" },
    { id: "Electric", label: "Electric" },
  ];

  const filteredCars = cars.filter((car) => {
    const matchesCategory = selectedCategory === "all" || car.category === selectedCategory;
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         car.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="cars"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Fleet
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury vehicles available across major cities in India
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
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
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card border-border p-0 space-y-4">
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
          ) : filteredCars.length > 0 ? (
            filteredCars.map((car) => {
              const availability = getAvailability(car.id);
              const shaded = isShadedOut(car.id) || availability !== "Available";

              return (
                <Card
                  key={car.id}
                  className={`group overflow-hidden hover:shadow-lg transition-all duration-150 hover:-translate-y-1 bg-card border-border relative ${shaded ? "grayscale opacity-60" : ""
                    }`}
                >
                  {/* Availability Badge */}
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${availability === "Available"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : availability === "Booked"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                    {availability}
                  </div>

                  {/* Car Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-150 ${car.name === "Jaguar XE" ? "scale-x-[-1]" : ""
                        }`}
                    />
                    {shaded && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="text-white font-black text-xs uppercase tracking-tighter border-2 border-white/50 px-3 py-1 rotate-12">
                          {availability === "Available" ? "Reservation Required" : availability}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, car.id)}
                      className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-background transition-all hover:scale-110 z-10"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : ""
                          }`}
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
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={shaded ? "#" : `/cars/${car.id}`} className="block">
                      <Button
                        disabled={shaded}
                        className={`w-full transition-all ${shaded
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          }`}
                      >
                        {shaded ? "Unavailable" : "View Details"}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Search className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
              <div className="space-y-1">
                <p className="text-xl font-bold text-foreground">No vehicles found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search keywords</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">₹480 - ₹720</div>
            <p className="text-muted-foreground">
              Flexible Pricing for Every Budget
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <p className="text-muted-foreground">Round the Clock Support</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary">50+</div>
            <p className="text-muted-foreground">Cities Across India</p>
          </div>
        </div>
      </div>
    </section>
  );
}
