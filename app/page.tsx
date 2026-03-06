import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { CarsShowcase } from "@/components/cars-showcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <CarsShowcase />
    </main>
  );
}
