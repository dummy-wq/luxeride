import { Navigation } from "@/components/navigation";
import { CarsShowcase } from "@/components/cars-showcase";
import { Contact } from "@/components/contact";

export default function CarsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <CarsShowcase />
      </div>
      <Contact />
    </main>
  );
}
