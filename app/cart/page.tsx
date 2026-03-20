"use client";

import { useCart } from "@/lib/context/cart-context";
import { siteConfig } from "@/template/config";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Minus, 
  Plus, 
  ShoppingBag, 
  MapPin, 
  Shield, 
  Loader2, 
  CheckCircle2,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { INDIAN_CITIES } from "@/lib/constants";

export default function CartPage() {
  const { items, totalItems, totalCost, updateQuantity, removeItem, clearCart } = useCart();
  const { user, login } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState(INDIAN_CITIES[0]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  
  const [isCheckoutInProgress, setIsCheckoutInProgress] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "success" | "error">("idle");
  const [profileUpdateError, setProfileUpdateError] = useState("");
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (siteConfig.template.mode !== "shopping") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      setLicenseNumber(user.licenseNumber || "");
      setAddress(user.address || "");
      if (user.city && INDIAN_CITIES.includes(user.city)) {
        setSelectedCity(user.city);
      }
    }
  }, [user]);

  if (!mounted || siteConfig.template.mode !== "shopping") return null;

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    // Comprehensive Profile Update Logic (similar to CarDetailPage)
    const isProfileIncomplete = !user.phone || !user.licenseNumber || !user.address || !user.city;
    if (isProfileIncomplete || phone !== user.phone || licenseNumber !== user.licenseNumber || address !== user.address || selectedCity !== user.city) {
      setIsProfileUpdating(true);
      setProfileUpdateError("");
      try {
        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({
            phone,
            licenseNumber,
            address,
            city: selectedCity,
          }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          login(updatedUser.user, localStorage.getItem("auth_token")!);
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

    setIsCheckoutInProgress(true);
    // Simulate payment/order processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCheckoutStatus("success");
    setIsCheckoutInProgress(false);
    
    // In a real app, you'd call an API to create an order
    // For now we just mock success
    // clearCart(); // We'll clear it on "Complete" or after showing success
  };

  if (checkoutStatus === "success") {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 pb-16 px-4 max-w-3xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <CheckCircle2 className="w-24 h-24 text-primary relative animate-in zoom-in duration-500" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight">ORDER PLACED!</h1>
            <p className="text-xl text-muted-foreground font-medium">
              Thank you for your purchase. Your premium items are being prepared for delivery.
            </p>
          </div>

          <Card className="p-8 bg-card border-primary/20 border-2 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-inner flex-shrink-0">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
                        alt="Order QR"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="space-y-4 flex-1">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Customer</p>
                        <p className="text-lg font-bold">{user?.fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Total Paid</p>
                            <p className="text-lg font-bold text-primary">{formatPrice(Math.round(totalCost * 1.18))}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Items</p>
                            <p className="text-lg font-bold">{totalItems}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Delivery To</p>
                        <p className="text-sm font-medium">{address}, {selectedCity}</p>
                    </div>
                </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full font-bold px-10 h-14" onClick={() => {
                clearCart();
                router.push("/cars");
            }}>
                Back to Shop
            </Button>
            <Button variant="outline" size="lg" className="rounded-full font-bold px-10 h-14" onClick={() => window.print()}>
                Print Receipt
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
              CHECKOUT
            </h1>
            <p className="text-muted-foreground font-medium">
              Complete your order and secure your premium items
            </p>
          </div>
          <Link href="/cars" className="text-primary font-bold hover:underline flex items-center gap-2">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-6 bg-card border border-dashed border-border rounded-xl">
            <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto" />
            <h3 className="text-2xl font-bold">Your cart is empty</h3>
            <Link href="/cars">
              <Button size="lg" className="font-bold px-10 h-14 rounded-full">
                Explore Items
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Items & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Details */}
              <Card className="p-6 bg-card border-border space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Delivery Destination</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Delivery City
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50"
                    >
                      {INDIAN_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Street Address
                    </label>
                    <textarea
                      placeholder="Floor, apartment, street name, etc."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </Card>

              {/* Personal Details / Identity */}
              <Card className="p-6 bg-card border-border space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Identity Verification</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                    For high-value premium purchases, we require valid identity and contact details for insurance and secure delivery.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      ID Proof / License No.
                    </label>
                    <input
                      type="text"
                      placeholder="Identity Document No."
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                {profileUpdateError && (
                    <p className="text-xs text-destructive bg-destructive/10 p-3 rounded border border-destructive/20">{profileUpdateError}</p>
                )}
              </Card>

              {/* Items Summary (Compact) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold px-1">Your Selected Items ({items.length})</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center p-3 bg-secondary/30 rounded-xl border border-border group overflow-hidden">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground uppercase font-black">{item.category}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-2 py-0.5">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-primary"><Minus className="w-3 h-3" /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-border shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                  
                  <h2 className="text-2xl font-black text-foreground mb-8">PAYMENT SUMMARY</h2>
                  
                  {user && (
                    <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Purchasing as</p>
                        <p className="font-bold text-foreground">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Subtotal</span>
                      <span className="text-foreground">{formatPrice(totalCost)}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground font-semibold">
                        <span>Delivery</span>
                        <span className="text-green-500 font-black">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Secure Admin Fee (18%)</span>
                      <span className="text-foreground">{formatPrice(Math.round(totalCost * 0.18))}</span>
                    </div>
                    
                    <div className="pt-6 border-t border-border flex justify-between items-baseline">
                      <span className="text-lg font-black text-foreground">TOTAL TO PAY</span>
                      <div className="text-right">
                          <span className="text-4xl font-black text-primary block">
                              {formatPrice(Math.round(totalCost * 1.18))}
                          </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-10 h-16 rounded-2xl font-black text-xl group bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] relative overflow-hidden"
                    onClick={handleCheckout}
                    disabled={isCheckoutInProgress || isProfileUpdating}
                  >
                    {isProfileUpdating ? (
                         <span className="flex items-center gap-2">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             UPDATING IDENTITY...
                         </span>
                    ) : isCheckoutInProgress ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            PROCESSING SECURELY...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            CONFIRM ORDER
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                  </Button>
                  
                  <div className="mt-8 pt-8 border-t border-border/50 text-center space-y-4">
                    <div className="flex justify-center gap-3">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">Premium Satisfaction Guaranteed</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        By clicking "Confirm Order", you agree to our premium service terms and identity verification policy.
                    </p>
                  </div>
                </Card>

                <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                    <Image src="/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto" />
                    <Image src="/upi.svg" alt="UPI" width={40} height={25} className="h-6 w-auto" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
