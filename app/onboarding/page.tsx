"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { INDIAN_CITIES } from "@/lib/constants";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    licenseNumber: "",
    age: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update global context
        updateUser(data.user);
        setSuccess(true);
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 px-4">
        <Card className="max-w-md mx-auto p-8 bg-card border-border">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Help us know you better for a faster booking experience.
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4 py-8">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto animate-bounce" />
              <h2 className="text-xl font-bold text-foreground">
                Profile Updated!
              </h2>
              <p className="text-muted-foreground">
                Redirecting to your profile...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="DL-XXXXXXXXXX"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123, Luxury Lane"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled>Select your city</option>
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
