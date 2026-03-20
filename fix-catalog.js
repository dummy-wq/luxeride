const fs = require('fs');

const path = 'template/catalog.ts';
let content = fs.readFileSync(path, 'utf8');

// Extract the existing cars array
const match = content.match(/export const cars = (\[[\s\S]*?\]);/);
if (!match) process.exit(1);

const carsArrayStr = match[1];
// Eval safely to get array
const cars = eval(carsArrayStr);

const missingIds = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21];

let newDbEntries = '';
missingIds.forEach(id => {
  const car = cars.find(c => c.id === id);
  if (!car) return;
  
  newDbEntries += `    "${car.id}": {
        id: "${car.id}",
        name: "${car.name}",
        model: "${car.model}",
        category: "${car.category}",
        price: ${car.price},
        mileage: "${car.mileage}",
        seats: ${car.seats},
        fuel: "${car.fuel}",
        transmission: "${car.transmission}",
        engine: "Standard Spec",
        power: "N/A",
        torque: "N/A",
        acceleration: "N/A",
        topSpeed: "N/A",
        features: [
            "Premium Upholstery",
            "Advanced Infotainment",
            "Safety Package"
        ],
        insurance: "Comprehensive Coverage Included",
        cancellation: "Free Cancellation up to 24 hours",
        image: "${car.image}",
    },\n`;
});

content = content.replace(/};\s*$/, newDbEntries + "};\n");

fs.writeFileSync(path, content);
console.log("Updated catalog.ts successfully.");
