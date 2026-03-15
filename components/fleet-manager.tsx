"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Search, 
    Plus, 
    Edit2, 
    Trash2, 
    Car, 
    Fuel, 
    Gauge, 
    Users as UsersIcon,
    AlertCircle,
    CheckCircle2,
    X
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface CarRecord {
    _id?: string;
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    fuel: string;
    transmission: string;
    seats: number;
    mileage: string;
}

export function FleetManager() {
    const { toast } = useToast();
    const [cars, setCars] = useState<CarRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<CarRecord | null>(null);

    const fetchCars = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/cars");
            if (!response.ok) throw new Error("Failed to fetch cars");
            const data = await response.json();
            setCars(data.cars || []);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load fleet data",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this vehicle from the fleet?")) return;

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/cars/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Delete failed");

            toast({
                title: "Vehicle Removed",
                description: "The car has been removed from the fleet successfully."
            });
            fetchCars();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete vehicle",
                variant: "destructive"
            });
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const carData = Object.fromEntries(formData.entries());
        
        // Convert types
        const payload = {
            ...carData,
            price: Number(carData.price),
            seats: Number(carData.seats),
            id: editingCar ? editingCar.id : Date.now() // Simple unique ID for mock logic
        };

        try {
            const token = localStorage.getItem("auth_token");
            const url = editingCar ? `/api/cars/${editingCar._id}` : "/api/cars";
            const method = editingCar ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Save failed");

            toast({
                title: editingCar ? "Vehicle Updated" : "Vehicle Added",
                description: "The fleet has been updated successfully."
            });
            setIsModalOpen(false);
            setEditingCar(null);
            fetchCars();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save vehicle",
                variant: "destructive"
            });
        }
    };

    const filteredCars = cars.filter(car => 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search fleet by name or category..."
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
                    className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Add New Vehicle
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="h-64 animate-pulse bg-muted/50 border-border" />
                    ))
                ) : filteredCars.length > 0 ? (
                    filteredCars.map((car) => (
                        <Card key={car._id} className="group overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20">
                            <div className="relative h-40 bg-muted overflow-hidden">
                                <Image 
                                    src={car.image} 
                                    alt={car.name} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-end gap-2">
                                    <Button 
                                        onClick={() => { setEditingCar(car); setIsModalOpen(true); }}
                                        size="sm" 
                                        variant="secondary" 
                                        className="h-8 w-8 p-0 rounded-full"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button 
                                        onClick={() => handleDelete(car._id!)}
                                        size="sm" 
                                        variant="destructive" 
                                        className="h-8 w-8 p-0 rounded-full"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase rounded">
                                    {car.category}
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">{car.name}</h3>
                                    <span className="text-primary font-bold">₹{car.price}/hr</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Fuel className="w-3 h-3" /> {car.fuel}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Gauge className="w-3 h-3" /> {car.transmission}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <UsersIcon className="w-3 h-3" /> {car.seats} Seats
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <AlertCircle className="w-3 h-3" /> {car.mileage}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                        <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">No vehicles found</p>
                        <p className="text-muted-foreground">Start build your fleet by adding a vehicle.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl bg-card border-border shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</h2>
                                <p className="text-sm text-muted-foreground">Fill in the details for your fleet inventory</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Vehicle Name</label>
                                    <input name="name" defaultValue={editingCar?.name} required className="w-full px-4 py-2 bg-input border border-border rounded-lg" placeholder="e.g. BMW 7 Series" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                                    <select name="category" defaultValue={editingCar?.category || "Sedan"} className="w-full px-4 py-2 bg-input border border-border rounded-lg">
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>Hatchback</option>
                                        <option>Electric</option>
                                        <option>Luxury</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price per Hour (₹)</label>
                                    <input name="price" type="number" defaultValue={editingCar?.price} required className="w-full px-4 py-2 bg-input border border-border rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Image URL</label>
                                    <input name="image" defaultValue={editingCar?.image} required className="w-full px-4 py-2 bg-input border border-border rounded-lg" placeholder="/cars/your-car.jpg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fuel Type</label>
                                    <input name="fuel" defaultValue={editingCar?.fuel || "Petrol"} className="w-full px-4 py-2 bg-input border border-border rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Transmission</label>
                                    <input name="transmission" defaultValue={editingCar?.transmission || "Automatic"} className="w-full px-4 py-2 bg-input border border-border rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Seats</label>
                                    <input name="seats" type="number" defaultValue={editingCar?.seats || 5} className="w-full px-4 py-2 bg-input border border-border rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mileage/Range</label>
                                    <input name="mileage" defaultValue={editingCar?.mileage || "12 km/l"} className="w-full px-4 py-2 bg-input border border-border rounded-lg" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="submit" className="flex-1 bg-primary text-primary-foreground py-6 font-bold text-lg">
                                    {editingCar ? "Update Vehicle" : "Add to Fleet"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="px-8 border-border">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
