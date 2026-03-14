/**
 * Site Configuration
 * ==================
 * Central configuration for the entire LuxeRide template.
 * Edit this file to rebrand, change copy, or customize the site.
 */

export const siteConfig = {
  // ── Brand ──────────────────────────────────────────────
  brand: {
    name: "LuxeRide",
    logoLetter: "L",
    tagline: "Premium Car Rentals in India",
    description: "Experience luxury car rentals with premium vehicles across India",
    phone: "+91 800-LUXERIDE",
    email: "support@luxeride.in",
    foundedYear: 2020,
  },

  // ── Navigation ─────────────────────────────────────────
  navigation: {
    links: [
      { href: "/cars", label: "Cars" },
      { href: "/about", label: "About" },
      { href: "/help-and-support", label: "Help & Support" },
    ],
  },

  // ── Hero Section ───────────────────────────────────────
  hero: {
    badge: "Premium Fleet Available",
    headingLine1: "DRIVE",
    headingLine2: "THE ICON",
    subheading:
      "Curating the world\u2019s most exclusive automotive experiences. Luxury is no longer a choice, it\u2019s a standard.",
    ctaLabel: "Explore Now",
    stats: [
      { value: "500+", label: "Fleet" },
      { value: "24/7", label: "Concierge" },
      { value: "0%", label: "Compromise" },
    ],
    darkImage: "/hero-dark-premium.jpg",
    lightImage: "/hero-light-premium.png",
  },

  // ── Cars Page ──────────────────────────────────────────
  carsPage: {
    heading: "Our Fleet",
    subheading: "Handpicked luxury vehicles available across major cities in India",
    categories: [
      { id: "all", label: "All Vehicles" },
      { id: "SUV", label: "SUV" },
      { id: "Sedan", label: "Sedan" },
      { id: "Hatchback", label: "Hatchback" },
      { id: "Electric", label: "Electric" },
    ],
    searchPlaceholder: "Search by name or category...",
    noResultsTitle: "No vehicles found",
    noResultsSubtitle: "Try adjusting your filters or search keywords",
    stats: [
      { value: "₹220 - ₹720", label: "Flexible Pricing for Every Budget" },
      { value: "24/7", label: "Round the Clock Support" },
      { value: "50+", label: "Cities Across India" },
    ],
  },

  // ── About Page ─────────────────────────────────────────
  about: {
    badge: "About LuxeRide",
    heading: "Luxury Car Rentals Reimagined",
    intro:
      "Since 2020, LuxeRide has been transforming the luxury car rental experience in India. We believe everyone deserves to experience the thrill of driving a premium vehicle.",
    story: [
      "LuxeRide was founded with a simple vision: to make luxury car rentals accessible, transparent, and hassle-free for everyone. Our founders recognized the gap between expensive luxury rentals and budget options with no middle ground.",
      "Today, we operate across 50+ cities in India with a fleet of over 500 premium vehicles, from classic luxury sedans to the latest sports cars and electric vehicles. We\u2019ve served over 10,000 happy customers and continue to grow.",
      "Our commitment remains unchanged: provide the best luxury rental experience with unmatched customer service, transparent pricing, and a carefully curated fleet of vehicles.",
    ],
    values: [
      {
        icon: "Zap",
        title: "Innovation",
        description: "Cutting-edge technology for seamless booking and vehicle management",
      },
      {
        icon: "Shield",
        title: "Safety First",
        description: "Rigorous maintenance and comprehensive insurance coverage",
      },
      {
        icon: "Users",
        title: "Customer Focus",
        description: "24/7 support and personalized service for every rental",
      },
      {
        icon: "Award",
        title: "Excellence",
        description: "Premium fleet of luxury vehicles with exceptional quality",
      },
    ],
    team: [
      { name: "Rajesh Kumar", role: "Founder & CEO", initials: "RK" },
      { name: "Priya Sharma", role: "Chief Operations Officer", initials: "PS" },
      { name: "Arjun Patel", role: "Head of Fleet Management", initials: "AP" },
      { name: "Ananya Gupta", role: "Customer Experience Lead", initials: "AG" },
    ],
    stats: [
      { value: "4+", label: "Years of Excellence" },
      { value: "500+", label: "Premium Vehicles" },
      { value: "10K+", label: "Happy Customers" },
      { value: "50+", label: "Cities Served" },
    ],
    ctaHeading: "Ready to Experience Luxury?",
    ctaSubheading: "Start your next adventure with LuxeRide today",
    ctaPrimary: "Browse Our Fleet",
    ctaSecondary: "Join Us Today",
  },

  // ── Help & Support Page ────────────────────────────────
  helpAndSupport: {
    heading: "Help & Support",
    subheading: "Everything you need to know about renting with LuxeRide.",
    policiesHeading: "Policies & Information",
    policiesSubheading: "Clear, transparent guidelines for a seamless luxury experience.",
  },

  // ── Contact Widget ─────────────────────────────────────
  contact: {
    heading: "Contact Us",
    successTitle: "Message sent!",
    successDescription: "Expect an email back within 24 hours.",
    sendLabel: "Send Message",
  },

  // ── Booking Info ───────────────────────────────────────
  booking: {
    freeCancellation: "Free Cancellation up to 24 hours",
    support: "24/7 Customer Support",
    insurance: "Comprehensive Insurance",
  },
} as const;

export type SiteConfig = typeof siteConfig;
