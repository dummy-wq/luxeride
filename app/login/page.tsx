"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = (data: AuthResponse) => {
    // Correctly extract user from response data
    const user = data.user || data;
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
        {/* Top Bar: Back + Logo */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 font-bold text-lg group transition-smooth">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs shadow-md group-hover:scale-105 transition-smooth">
              ⚡
            </div>
            <span className="text-foreground tracking-tight">LuxeRide</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <AuthForm type="login" onSubmit={handleSubmit} />
        </div>

        {/* Additional Info */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 text-center text-sm">
          <p className="text-muted-foreground text-xs">
            Use any email to sign in for this demo
          </p>
        </div>
      </div>
    </main>
  );
}
