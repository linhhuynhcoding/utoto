import fs from "fs";
import path from "path";
import prisma from ".";

async function runSql(file: string) {
  const sql = fs.readFileSync(file, "utf8");
  await prisma.$executeRawUnsafe(sql);
}

async function seedFeatures() {
  const filePath = path.join(__dirname, "./data/features.json");
  const features = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const feature of features) {
    await prisma.features.upsert({
      where: { id: feature.id },
      update: {
        logo: feature.logo,
        name: feature.name,
      },
      create: {
        id: feature.id,
        logo: feature.logo,
        name: feature.name,
      },
    });
  }
}

async function seedBrands() {
  const filePath = path.join(__dirname, "./data/brands.json");
  const brands = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const brand of brands) {
    await prisma.brands.upsert({
      where: {
        brand_id: BigInt(brand.brand_id),
      },
      update: {
        brand_name: brand.brand_name,
        logo: brand.logo,
      },
      create: {
        brand_id: BigInt(brand.brand_id),
        brand_name: brand.brand_name,
        logo: brand.logo,
      },
    });
  }
}

const CAR_MODELS: Record<string, string[]> = {
  Toyota: [
    "Vios",
    "Camry",
    "Fortuner",
    "Innova",
    "Corolla Altis",
    "Wigo",
    "Rush",
    "Hilux",
    "Yaris",
    "Avanza",
    "Veloz",
    "Raize",
    "Land Cruiser",
  ],
  Honda: ["City", "Civic", "CR-V", "HR-V", "Brio", "Accord", "Jazz", "BR-V"],
  Hyundai: [
    "Accent",
    "Grand i10",
    "SantaFe",
    "Tucson",
    "Creta",
    "Elantra",
    "Stargazer",
    "Kona",
    "Venue",
    "Custin",
    "Palisade",
    "Ioniq 5",
  ],
  Kia: [
    "Morning",
    "K3",
    "Cerato",
    "Seltos",
    "Sonet",
    "Carnival",
    "Sorento",
    "Soluto",
    "Carens",
    "Rondo",
    "Sportage",
  ],
  Vinfast: [
    "Fadil",
    "Lux A2.0",
    "Lux SA2.0",
    "VF e34",
    "VF 8",
    "VF 9",
    "VF 5",
    "VF 3",
    "President",
    "VF 6",
    "VF 7",
  ],
  Mazda: [
    "Mazda 3",
    "Mazda 6",
    "CX-5",
    "CX-8",
    "Mazda 2",
    "CX-3",
    "CX-30",
    "BT-50",
  ],
  Mitsubishi: [
    "Xpander",
    "Outlander",
    "Attrage",
    "Triton",
    "Pajero Sport",
    "Xforce",
  ],
  Ford: ["Ranger", "Everest", "Explorer", "Territory", "Transit", "EcoSport"],
  Mercedes: [
    "C-Class",
    "E-Class",
    "S-Class",
    "GLC",
    "GLB",
    "GLE",
    "GLS",
    "A-Class",
    "CLA",
    "V-Class",
    "G-Class",
    "Maybach",
  ],
  BMW: [
    "3 Series",
    "5 Series",
    "7 Series",
    "X1",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "iX3",
    "i4",
    "i7",
  ],
  Audi: ["A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron GT"],
  Lexus: ["ES", "LS", "NX", "RX", "GX", "LX", "IS"],
  Peugeot: ["2008", "3008", "5008", "408", "Traveller"],
  Porsche: [
    "Macan",
    "Cayenne",
    "Panamera",
    "911",
    "Taycan",
    "718 Boxster",
    "718 Cayman",
  ],
  Suzuki: ["XL7", "Ertiga", "Swift", "Ciaz", "Jimny"],
  Subaru: ["Forester", "Outback", "BRZ", "WRX"],
  Isuzu: ["D-Max", "mu-X"],
  Nissan: ["Almera", "Navara", "Kicks", "Terra"],
  MG: ["ZS", "HS", "MG5", "RX5"],
  Volkswagen: ["Tiguan", "Teramont", "Touareg", "Virtus", "T-Cross", "Viloran"],
  Volvo: ["XC40", "XC60", "XC90", "S90", "V60 Cross Country"],
  "Land Rover": [
    "Range Rover",
    "Range Rover Sport",
    "Range Rover Velar",
    "Range Rover Evoque",
    "Discovery",
    "Discovery Sport",
    "Defender",
  ],
  Mini: ["Cooper", "Countryman", "Clubman"],
  Jeep: ["Wrangler", "Gladiator", "Grand Cherokee"],
  Ram: ["1500", "TRX"],
  Wuling: ["HongGuang MiniEV"],
  Haval: ["H6"],
  Skoda: ["Kodiaq", "Karoq"],
};

async function seedModels() {
  const filePath = path.join(__dirname, "./data/brands.json");
  const brands = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const brand of brands) {
    const models = CAR_MODELS[brand.brand_name];
    if (models) {
      let modelIndex = 1;
      for (const modelName of models) {
        // Generate a simpler deterministic ID: brand_id * 1000 + index
        const modelId = BigInt(brand.brand_id) * 1000n + BigInt(modelIndex);

        await prisma.car_models.upsert({
          where: { model_id: modelId },
          update: {
            brand_id: BigInt(brand.brand_id),
            model_name: modelName,
          },
          create: {
            model_id: modelId,
            brand_id: BigInt(brand.brand_id),
            model_name: modelName,
          },
        });
        modelIndex++;
      }
    }
  }
}

async function seedUsers() {
  const users = [
    {
      id: "USER_1",
      name: "Owner User",
      email: "owner@example.com",
      phone_number: "0901234567",
      phone_code: "+84",
      isVerified: true,
      avatar: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_1280.png"
    },
    {
      id: "USER_2",
      name: "Renter User",
      email: "renter@example.com",
      phone_number: "0901234568",
      phone_code: "+84",
      isVerified: true,
      avatar: "https://cdn.pixabay.com/photo/2016/11/18/19/07/happy-1836445_1280.jpg"
    },
  ];

  for (const user of users) {
    await prisma.users.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
}

async function seedCars() {
  const brands = await prisma.brands.findMany({
    include: { car_models: true },
  });

  if (brands.length === 0) {
    console.log("No brands found, skipping car seed");
    return;
  }

  // Clear existing car data to ensure a fresh "redistribution"
  console.log("Clearing existing car data...");
  await prisma.car_images.deleteMany({});
  await prisma.car_features.deleteMany({});
  await prisma.trips.deleteMany({});
  await prisma.cars.deleteMany({});
  // We don't delete locations here as they are created per car, 
  // and deleting cars might leave orphaned locations if not handled by DB.
  // Actually, better to delete locations too to keep DB clean.
  await prisma.locations.deleteMany({});

  const CAR_IMAGES = {
    sedan: [
      "https://cdn.pixabay.com/photo/2012/11/02/13/02/car-63930_1280.jpg",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
      "https://cdn.pixabay.com/photo/2016/11/18/12/52/automobile-1834274_1280.jpg",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549399542-7bd331b960e3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad93d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542362567-b055002b91f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526726538690-5cbf95642cb4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517524008410-b44c6659bc95?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
    ],
    suv_mpv: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502161721776-64cff20743b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1471444635702-392af6532ece?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549399542-7bd331b960e3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542362567-b055002b91f4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507113136607-bc898daee42a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1462396240927-52058a6a84ec?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582132338006-03c090559795?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515569062391-4560ea51630c?auto=format&fit=crop&q=80&w=800",
    ],
    luxury: [
      "https://cdn.pixabay.com/photo/2016/12/03/18/57/car-1880381_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/21/14/53/bentley-1845814_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/22/23/44/porsche-1851246_1280.jpg",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1555215695-3004980ad93d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
    ]
  };

  const getCarImage = (brand: string, model: string, index: number, seatCount: number) => {
    const brandLower = brand.toLowerCase();
    const luxuryBrands = ["mercedes", "bmw", "audi", "lexus", "porsche", "land rover"];

    if (luxuryBrands.some(lb => brandLower.includes(lb))) {
      return CAR_IMAGES.luxury[index % CAR_IMAGES.luxury.length];
    }

    if (seatCount >= 7) {
      return CAR_IMAGES.suv_mpv[index % CAR_IMAGES.suv_mpv.length];
    }

    return CAR_IMAGES.sedan[index % CAR_IMAGES.sedan.length];
  };

  const transmissionTypes = ["AUTOMATIC", "MANUAL"];
  const fuelTypes = ["GASOLINE", "DIESEL", "ELECTRIC"];

  // Fetch more districts for better location coverage
  const availableDistricts = await prisma.districts.findMany({
    include: { wards: true },
  });

  const brandsWithModels = brands.filter(b => b.car_models.length > 0);

  console.log("Generating 50 random cars...");

  for (let i = 1; i <= 50; i++) {
    // Random brand and model from brands that actually have models
    const randomBrand = brandsWithModels[Math.floor(Math.random() * brandsWithModels.length)];

    const randomModel =
      randomBrand.car_models[
      Math.floor(Math.random() * randomBrand.car_models.length)
      ];

    const seat = Math.random() > 0.8 ? 7 : 4;
    const randomImage = getCarImage(randomBrand.brand_name, randomModel.model_name, i, seat);
    const transmission =
      transmissionTypes[Math.floor(Math.random() * transmissionTypes.length)];
    const fuel = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];

    const carId = `CAR_${i}`;
    const price = 500000 + Math.floor(Math.random() * 100) * 10000; // 500k - 1.5m

    // Random rental types - ensure at least one is true
    const is_self_driving = Math.random() > 0.3;
    const is_with_driver = Math.random() > 0.7;
    const is_long_term = Math.random() > 0.8;

    // Pick a random location
    let locationId: bigint | null = null;
    if (availableDistricts.length > 0) {
      const randomDistrict =
        availableDistricts[
        Math.floor(Math.random() * availableDistricts.length)
        ];
      const randomWard =
        randomDistrict.wards[
        Math.floor(Math.random() * randomDistrict.wards.length)
        ];

      if (randomWard) {
        const location = await prisma.locations.create({
          data: {
            province_id: randomDistrict.province_code || "0",
            district_id: randomDistrict.code,
            ward_id: randomWard.code,
            street: `${Math.floor(Math.random() * 200) + 1} Đường số ${Math.floor(Math.random() * 50) + 1}`,
          },
        });
        locationId = location.id;
      }
    }

    await prisma.cars.upsert({
      where: { id: carId },
      update: {
        location_id: locationId,
        is_self_driving: is_self_driving || (!is_with_driver && !is_long_term),
        is_with_driver: is_with_driver,
        is_long_term: is_long_term,
      },
      create: {
        id: carId,
        owner: "USER_1",
        name: `${randomBrand.brand_name} ${randomModel.model_name} 202${Math.floor(Math.random() * 4) + 2}`,
        desc: "Xe chất lượng cao, bảo dưỡng định kỳ, sạch sẽ thoáng mát, phù hợp cho mọi chuyến đi.",
        model_id: randomModel.model_id,
        transmission: transmission,
        seat: seat,
        engine_type: fuel,
        price: price,
        priceWithPlatformFee: price + 100000,
        location_id: locationId,
        is_self_driving: is_self_driving || (!is_with_driver && !is_long_term),
        is_with_driver: is_with_driver,
        is_long_term: is_long_term,
      },
    });

    // Seed image for this car
    await prisma.images.upsert({
      where: { url: randomImage },
      update: {},
      create: {
        url: randomImage,
        width: 800,
        height: 600,
      }
    });

    await prisma.car_images.createMany({
      data: [{ car_id: carId, image_url: randomImage }],
      skipDuplicates: true
    });
  }
}

async function seedTrips() {
  const trips = [
    {
      trip_id: "TRIP_1",
      renter_id: "USER_2",
      car_id: "CAR_1",
      status: "PENDING",
      from_date: new Date("2024-02-01T10:00:00Z"),
      to_date: new Date("2024-02-03T10:00:00Z"),
      ship_method: 1,
      ship_fee: 50000,
      rent_amount: 1500000, // 3 days * 500k approx
    },
    {
      trip_id: "TRIP_2",
      renter_id: "USER_2",
      car_id: "CAR_1",
      status: "COMPLETED",
      from_date: new Date("2024-01-01T10:00:00Z"),
      to_date: new Date("2024-01-02T10:00:00Z"),
      ship_method: 1,
      ship_fee: 50000,
      rent_amount: 500000,
    },
  ];

  for (const trip of trips) {
    await prisma.trips.upsert({
      where: { trip_id: trip.trip_id },
      update: {},
      create: trip,
    });
  }
}

async function main() {
  console.log("🌱 Seeding data...");

  await seedFeatures();
  await seedBrands();
  await seedModels();
  await seedUsers();
  await runSql(path.join(__dirname, "./data/IMPORT_DATA_VN_UNITS.sql"));
  await seedCars();

  await seedUsers();
  await seedCars();
  await seedTrips();

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
