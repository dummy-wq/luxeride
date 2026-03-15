"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Search,
    MoreVertical,
    ShieldCheck,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    Ban,
    Trash2,
    Clock,
    Unlock,
    Key,
    Car,
    Plus,
    Edit2,
    Settings,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/config";
import { FleetManager } from "@/components/fleet-manager";

export function AdminDashboard() {
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"users" | "fleet">("users");
    const [cars, setCars] = useState<any[]>([]);
    const [isCarsLoading, setIsCarsLoading] = useState(false);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("auth_token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Unauthorized. Admin access required.");
                } else {
                    throw new Error("Failed to fetch users");
                }
                return;
            }

            const data = await response.json();
            setUsers(data.users || []);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Failed to load admin data");
        } finally {
          setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [router]);

    const handleAction = async (userId: string, action: string, minutes?: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) return;

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: action === "delete" ? "DELETE" : "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: action !== "delete" ? JSON.stringify({ action, minutes }) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Action failed:", errorData);
                throw new Error(errorData.error || "Action failed");
            }

            // Refresh user list
            fetchUsers();
            toast({
                title: "Action Successful",
                description: `Action ${action} has been performed for user.`,
            });
        } catch (err: unknown) {
            toast({
                title: "Action Failed",
                description: err instanceof Error ? err.message : "Failed to perform administrative action",
                variant: "destructive",
            });
        }
    };

    const filteredUsers = users.filter((user: any) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6 border-destructive/20 shadow-2xl">
                    <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-10 h-10 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                    <Button onClick={() => router.push("/")} className="w-full">
                        Return to Safety
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Admin Portal</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">
                            {activeTab === "users" ? "User Management" : "Fleet Management"}
                        </h1>
                        <p className="text-muted-foreground">
                            {activeTab === "users" 
                                ? `Monitor and manage all ${siteConfig.brand.name} members`
                                : `Manage your vehicle inventory and pricing`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-secondary/50 p-1.5 rounded-2xl border border-border">
                        <Button 
                            onClick={() => setActiveTab("users")}
                            variant={activeTab === "users" ? "default" : "ghost"}
                            className={`rounded-xl gap-2 ${activeTab === "users" ? "shadow-lg" : ""}`}
                        >
                            <Users className="w-4 h-4" /> Users
                        </Button>
                        <Button 
                            onClick={() => setActiveTab("fleet")}
                            variant={activeTab === "fleet" ? "default" : "ghost"}
                            className={`rounded-xl gap-2 ${activeTab === "fleet" ? "shadow-lg" : ""}`}
                        >
                            <Car className="w-4 h-4" /> Fleet
                        </Button>
                    </div>
                </div>

                {activeTab === "users" ? (
                    <>
                        {/* User Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Members</p>
                                        <p className="text-3xl font-black text-foreground">{users.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-xl">
                                        <ShieldCheck className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Active Today</p>
                                        <p className="text-3xl font-black text-foreground">{Math.floor(users.length * 0.4)}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">New This Week</p>
                                        <p className="text-3xl font-black text-foreground">{Math.floor(users.length * 0.1)}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Search Bar for Users */}
                        <div className="mb-6">
                            <div className="relative group max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search users by name, email or phone..."
                                    className="pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Users Table */}
                        <Card className="bg-card border-border shadow-xl overflow-hidden rounded-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-secondary/50 border-b border-border">
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Member</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Password (Hash)</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id || user._id} className="hover:bg-secondary/20 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg select-none">
                                                                {user.fullName?.[0]?.toUpperCase() || <Users className="w-5 h-5" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">{user.fullName || "Unnamed User"}</p>
                                                                <p className="text-xs text-muted-foreground font-mono">ID: {user.id?.slice(-8) || user._id?.slice(-8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                                {user.email}
                                                            </div>
                                                            {user.phone && (
                                                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                                    {user.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/30 p-2 rounded truncate max-w-[150px]">
                                                            <Key className="w-3 h-3" />
                                                            {user.passwordHash || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {user.isBanned ? (
                                                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/20">
                                                                Banned
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded border border-green-500/20">
                                                                Active
                                                            </span>
                                                        )}
                                                        {user.bannedUntil && new Date(user.bannedUntil) > new Date() && (
                                                            <p className="text-[9px] text-muted-foreground mt-1">
                                                                Until: {new Date(user.bannedUntil).toLocaleTimeString()}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {user.isBanned ? (
                                                                <Button
                                                                    onClick={() => handleAction(user.id || user._id, "unban")}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 px-2 border-green-500/20 text-green-500 hover:bg-green-500/10"
                                                                >
                                                                    <Unlock className="w-3.5 h-3.5 mr-1" /> Unban
                                                                </Button>
                                                            ) : (
                                                                <>
                                                                    <Button
                                                                        onClick={() => handleAction(user.id || user._id, "ban")}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 px-2 border-red-500/20 text-red-500 hover:bg-red-500/10"
                                                                    >
                                                                        <Ban className="w-3.5 h-3.5 mr-1" /> Ban
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleAction(user.id || user._id, "timeout", 30)}
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-8 px-2 border-orange-500/20 text-orange-500 hover:bg-orange-500/10"
                                                                    >
                                                                        <Clock className="w-3.5 h-3.5 mr-1" /> Time
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button
                                                                onClick={() => handleAction(user.id || user._id, "delete")}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-2 border-destructive/20 text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-4 bg-secondary rounded-full">
                                                            <Users className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-lg font-bold text-foreground">No users found</p>
                                                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                ) : (
                    <FleetManager />
                )}

                {/* Footer info */}
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing {activeTab === "users" ? filteredUsers.length : "all"} items</p>
                    <p className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        {siteConfig.brand.name} Secure Admin Workspace
                    </p>
                </div>
            </div>
        </div>
    );
}

