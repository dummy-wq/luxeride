"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Download,
  LogOut,
  Zap,
  CheckCircle2,
  Wallet,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { INDIAN_CITIES } from "@/lib/constants";

function CountdownTimer({ expireAt }: { expireAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(expireAt).getTime() - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expireAt]);

  return <span>{timeLeft}</span>;
}

export function ProfileContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("Not authenticated");
        setIsLoading(false);
        return;
      }

      // Fetch user profile
      const userResponse = await fetch("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch profile");
      }

      const userData = await userResponse.json();
      setUser(userData.user);
      setEditData(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));

      // Fetch payments
      const paymentsResponse = await fetch("/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData.payments || []);
      }

      // Fetch bookings
      const bookingsResponse = await fetch("/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear HTTP-only cookie via server endpoint
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userId");
    router.push("/");
  };

  const handleEdit = () => {
    setEditData({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...user });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert("An error occurred while saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground">Loading your profile...</p>
        </Card>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground mb-4">
            {error || "Please log in to view your profile"}
          </p>
          <a
            href="/login"
            className="text-primary font-semibold hover:text-primary/80"
          >
            Go to Login
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and view rental history
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-border text-foreground hover:bg-secondary"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-border space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {user.fullName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Member Stats */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rentals</p>
                  <p className="text-2xl font-bold text-primary">
                    {payments.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹
                    {payments
                      .reduce((acc, p) => acc + p.amount, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* LuxeCash Wallet */}
              <div className="pt-4 border-t border-border">
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-primary">LuxeCash Balance</h3>
                  </div>
                  <p className="text-3xl font-black text-foreground">
                    ₹{(user.walletBalance || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available for instant booking use
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-2 pt-4 border-t border-border">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "overview"
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-foreground hover:bg-secondary"
                    }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "payments"
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-foreground hover:bg-secondary"
                    }`}
                >
                  Payment History
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "settings"
                    ? "bg-primary/20 text-primary font-semibold"
                    : "text-foreground hover:bg-secondary"
                    }`}
                >
                  Settings
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Active Bookings with QR & Timer */}
                {bookings.filter((b: any) => b.status === "confirmed").length >
                  0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Active Bookings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookings
                          .filter((b: any) => b.status === "confirmed")
                          .map((booking: any) => (
                            <Card
                              key={booking.id}
                              className="p-4 bg-card border-primary/20 border-2 relative overflow-hidden group"
                            >
                              <div className="flex gap-4">
                                <div className="w-24 h-24 bg-white p-1 rounded-lg flex-shrink-0">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.qrCode || "LUXE-VOID"}`}
                                    alt="Booking QR"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="space-y-1 flex-1">
                                  <p className="text-sm font-bold text-foreground">
                                    {booking.carName}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Status: {booking.status}
                                  </p>
                                  <div className="mt-2 text-xs font-mono bg-primary/10 text-primary p-2 rounded inline-block">
                                    <CountdownTimer expireAt={booking.expireAt} />
                                  </div>
                                </div>
                                <div className="flex flex-col justify-between items-end ml-4">
                                  <div className="p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/cancel/${booking.id || booking._id}`)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 mt-auto z-10"
                                  >
                                    <XCircle className="w-4 h-4" /> Cancel
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Personal Information */}
                <Card className="p-6 bg-card border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.fullName || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <p className="text-foreground font-semibold">
                          {user.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Email Address
                      </label>
                      <p className="text-foreground font-semibold">
                        {user.email}
                      </p>
                      {isEditing && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Email cannot be changed
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.phone || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <p className="text-foreground font-semibold">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        License Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.licenseNumber || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              licenseNumber: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <p className="text-foreground font-semibold">
                          {user.licenseNumber || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Age
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.age || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              age: parseInt(e.target.value),
                            })
                          }
                          className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      ) : (
                        <p className="text-foreground font-semibold">
                          {user.age || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={handleEdit}
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Edit Information
                    </Button>
                  )}
                </Card>

                {/* Address */}
                <Card className="p-6 bg-card border-border space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Address
                  </h3>
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Current Address
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={editData.address || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                address: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <select
                            value={editData.city || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, city: e.target.value })
                            }
                            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="" disabled>Select your city</option>
                            {INDIAN_CITIES.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-foreground font-semibold">
                          {user.address || "Not provided"}{" "}
                          {user.city ? `, ${user.city}` : ""}
                        </p>
                      )}
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-secondary"
                      >
                        Update Address
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-6 shadow-lg transition-all active:scale-95"
                    >
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={isSaving}
                      variant="outline"
                      className="flex-1 border-border text-foreground py-6 font-bold hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                <Card className="bg-card border-border overflow-hidden">
                  <div className="px-6 py-4 border-b border-border bg-secondary/30">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment History
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Vehicle
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Method
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length > 0 ? (
                          payments.map((payment: any) => (
                            <tr
                              key={payment._id || payment.id}
                              className="border-b border-border hover:bg-secondary/30 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-foreground font-semibold">
                                {payment.carName || "Unknown Vehicle"}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground">
                                {new Date(
                                  payment.createdAt,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                                {payment.paymentMethod || "card"}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-primary">
                                ₹{payment.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.status === "completed"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                    : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                    }`}
                                >
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  Receipt
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-6 py-8 text-center text-muted-foreground"
                            >
                              No payment history yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-4">
                <Card className="p-6 bg-card border-border space-y-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Account Settings
                  </h3>
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer">
                      <span className="text-foreground">
                        Email Notifications
                      </span>
                      <div className="w-12 h-6 bg-primary rounded-full" />
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer">
                      <span className="text-foreground">SMS Notifications</span>
                      <div className="w-12 h-6 bg-primary rounded-full" />
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-secondary/30 rounded-lg transition-colors cursor-pointer">
                      <span className="text-foreground">Marketing Emails</span>
                      <div className="w-12 h-6 bg-border rounded-full" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border space-y-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Security
                  </h3>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary"
                  >
                    Two-Factor Authentication
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
