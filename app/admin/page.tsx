import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata = {
    title: "Admin Dashboard | LuxeRide",
    description: "Manage users and bookings for LuxeRide",
};

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground">
            <Navigation />
            <AdminDashboard />
        </main>
    );
}
