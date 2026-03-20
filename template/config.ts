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
    customLogo: null, // Set to a path (e.g., "/logo.png") to show an image to the left of the name
    logoLetter: "L", // Fallback letter used if no customLogo is provided
    tagline: "Premium Car Rentals in India",
    description: "Experience luxury car rentals with premium vehicles across India",
    phone: "+91 800-LUXERIDE",
    email: "support@luxeride.in",
    foundedYear: 2020,
  },

  // ── UI Settings ────────────────────────────────────────
  ui: {
    currencySymbol: "₹",
    walletName: "LuxeCash",
  },

  // ── Template Setting ──────────────────────────────────
  // Change "service" to "shopping" to switch the layout/logic from a rental service to an e-commerce store.
  template: {
    mode: "service" as "service" | "shopping",
    showAvailability: true, // Shows "Available", "Booked" etc on cards
    enableBooking: true,   // If false, replaces booking with direct purchase/contact
    // Shopping mode: quantity picker config
    quantity: {
      min: 1,
      max: 99,
      default: 1,
    },
  },

  // ── Taxonomy & Copy ────────────────────────────────────
  // Customize these labels to refactor the site into any niche (e.g., Real Estate, Watches, Yacht Club)
  taxonomy: {
    itemLabelSingular: "Car",
    itemLabelPlural: "Cars",
    categoryLabel: "Vehicle Type",
    actionLabel: "Book Now", // Global CTA text
    addToCartLabel: "Add to Cart", // Shopping mode CTA
    priceSuffix: "/hr",      // Text after price (e.g., "/day", "/each", or empty "")
    catalogHeading: "Our Fleet",
    catalogSubheading: "Handpicked premium vehicles for your next journey.",
    reservationRequiredLabel: "Reservation Required",
    ordersLabel: "Bookings", // "Orders" for shopping
    cartLabel: "Cart",       // Shopping cart label shown in nav
  },

  // ── Metadata & Icon Mapping ────────────────────────────
  // Define which fields from your data (in cars.ts) show up as 'Quick Specs' on the card and detail page.
  // This allows you to change the "Specs" without editing the UI code.
  metadataSchema: [
    { key: "mileage", label: "Mileage", icon: "Fuel" },
    { key: "seats", label: "Seats", icon: "Users" },
    { key: "transmission", label: "Gearbox", icon: "Gauge" },
    { key: "fuel", label: "Fuel", icon: "Droplet" },
  ],

  // ── Navigation ─────────────────────────────────────────
  navigation: {
    links: [
      { href: "/cars", label: "Fleet" }, // Managed by taxonomy in components, but links are here
      { href: "/about", label: "About" },
      { href: "/help-and-support", label: "Help & Support" },
    ],
  },

  // ── Hero Section ───────────────────────────────────────
  hero: {
    badge: "Premium Experience Awaits",
    headingLine1: "ELEVATE",
    headingLine2: "YOUR DRIVE",
    subheading:
      "Curating the world's most exclusive premium experiences. Luxury is no longer a choice, it's a standard.",
    ctaLabel: "Explore Catalog",
    stats: [
      { value: "500+", label: "Items" },
      { value: "24/7", label: "Support" },
      { value: "Premium", label: "Quality" },
    ],
    darkImage: "/hero-dark-premium.jpg",
    lightImage: "/hero-light-premium.png",
  },

  // ── Cars Page (Catalog) ────────────────────────────────
  carsPage: {
    heading: "Our Collection",
    subheading: "Browse through our handpicked selection of premium items.",
    categories: [
      { id: "all", label: "All Items" },
      { id: "SUV", label: "SUV" },
      { id: "Sedan", label: "Sedan" },
      { id: "Electric", label: "Electric" },
    ],
    searchPlaceholder: "Search our collection...",
    noResultsTitle: "Nothing found",
    noResultsSubtitle: "Try adjusting your filters or search keywords",
    stats: [
      { value: "Global", label: "Availability" },
      { value: "Verified", label: "Quality" },
      { value: "24/7", label: "Customer Care" },
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
