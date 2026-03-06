"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme || theme : "dark";

  const scrollToSection = () => {
    const element = document.getElementById("cars");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* 1. Solid Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* 2. Text Content (Left) */}
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
          <div className={`space-y-6 transition-all duration-200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border shadow-sm">
              <span className="inline-flex rounded-full h-2 w-2 bg-primary"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/80">
                Premium Fleet Available
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-foreground">
              DRIVE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                THE ICON
              </span>
            </h1>

            <p className="text-lg text-muted-foreground/90 max-w-md leading-relaxed font-medium">
              Curating the world&apos;s most exclusive automotive experiences.
              Luxury is no longer a choice, it&apos;s a standard.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/cars">
                <Button className="rounded-none px-8 py-7 bg-foreground text-background hover:bg-foreground/90 text-sm font-bold tracking-widest uppercase transition-all hover:gap-4 group">
                  Explore Now <ArrowRight className="w-4 h-4 transition-all group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Mini-Grid */}
          <div className={`grid grid-cols-3 gap-8 pt-12 border-t border-border/20 transition-all duration-200 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div>
              <div className="text-2xl font-black text-foreground">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fleet</div>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Concierge</div>
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">0%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Compromise</div>
            </div>
          </div>
        </div>

        {/* 3. The 'Gallery Frame' Featured Car (Right/Center) */}
        <div className="lg:col-span-7 relative order-1 lg:order-2">
          <div className={`relative transition-all duration-200 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-98"}`}>

            {/* Main Image Container — 0.95x size for better presence */}
            <div className={`relative aspect-[16/9] w-full scale-[0.95] origin-center overflow-hidden rounded-2xl shadow-2xl border ${currentTheme === 'dark' ? 'border-border/30 bg-[#0A0A0A]' : 'border-border/10 bg-white'
              }`}>
              {mounted && (
                <>
                  <Image
                    src="/hero-dark-premium.jpg"
                    alt="LuxeRide Featured Fleet Dark"
                    fill
                    className={`object-cover transition-opacity duration-150 ${currentTheme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
                    style={{ objectPosition: 'center' }}
                    quality={85}
                    priority
                  />
                  <Image
                    src="/hero-light-premium.png"
                    alt="LuxeRide Featured Fleet Light"
                    fill
                    className={`object-cover transition-opacity duration-150 ${currentTheme === 'light' ? 'opacity-100' : 'opacity-0'}`}
                    style={{ objectPosition: 'center' }}
                    quality={85}
                    priority
                  />
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 4. Elegant Scroll Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group cursor-pointer" onClick={scrollToSection}>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
        <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">
          Scroll
        </span>
      </div>

    </section>
  );
}
