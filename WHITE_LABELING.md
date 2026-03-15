# White-labeling Guide

This project has been architected to be highly customizable and easily white-labeled. You can re-brand the entire application, swap out the car catalog, and modify application features without needing to edit the core UI files.

Follow these steps to customize the template for your business.

## 1. Core Brand Configuration

All text, site names, contact info, and SEO metadata are dynamically loaded from a single source of truth.

1. Open `lib/config.ts`.
2. Locate the `brand` object:
```typescript
brand: {
  name: "YourBrandHere",
  logoLetter: "Y", // Optional fallback 
  logoDark: "/logo-dark.png", // Path to your dark mode logo
  logoLight: "/logo-light.png", // Path to your light mode logo
  tagline: "Your Catchy Tagline",
  description: "Description of your business for SEO.",
  phone: "+1 800-YOUR-PHONE",
  email: "contact@yourbrand.com",
  foundedYear: 2024,
}
```
3. Update these values. The application will instantly reflect the changes across all pages, headers, footers, meta tags, and receipts.

### 1.2 UI & Pricing Configuration

We have centralized the currency and virtual currency branding:

1. Locate the `ui` object in `lib/config.ts`:
```typescript
ui: {
  currencySymbol: "₹",    // Changes all pricing symbols universally
  walletName: "LuxeCash", // Changes your virtual wallet brand name
},
```
2. Update these to match your local currency (e.g., "$", "€") and desired wallet name.

## 2. Setting Up Your Logo

The application supports responsive light/dark mode logo switching.
1. Place your transparent `.png` or `.svg` logo files into the `public/` directory.
2. Update the `logoDark` and `logoLight` paths in `lib/config.ts` to match your filenames.
3. The navigation header will automatically slice the first letter off your `brand.name` if you want your logo graphic to double as the first letter (e.g., logo `[Y]` + text `ourBrand`).
    - *Note: To disable this behavior and show the full text, edit `components/navigation.tsx` and change `.slice(1)` back to the full variable.*

## 3. Customizing the Car Catalog

Your vehicle inventory is completely decoupled from the UI. 
1. Open `lib/data/cars.ts`.
2. To add a new car, create a new object in the `cars` and `carsDatabase` arrays:
```typescript
{
  id: "your-car-id",
  name: "2024 Model",
  brand: "Brand Name",
  type: "Luxury", // e.g. SUV, Sports, Sedan
  dailyPrice: 15000,
  image: "/cars/new-car.jpg", // Place image in public/cars/
  // ... see existing cars for all fields
}
```
3. The Search, Filtering, and Booking flows will automatically ingest your new cars.

## 4. Theme & Colors

The UI styling is powered by Tailwind CSS and CSS Variables. You can easily switch the brand colors:
1. Open `app/globals.css`.
2. Adjust the `--primary`, `--secondary`, and `--background` hex codes under `:root` (for Light Mode) and `.dark` (for Dark Mode).
3. We highly recommend using HSL or Hex variables to ensure components maintain contrast.

## 5. Deployment

When you are ready to deploy to production (e.g., Vercel, Netlify):
1. Run `npm run build` to ensure all configurations are typed correctly.
2. Set any needed API keys and environment variables in the host's dashboard.
3. Your site is ready!
