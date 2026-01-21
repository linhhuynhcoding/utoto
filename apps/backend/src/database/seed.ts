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
  await prisma.users.upsert({
    where: { id: "USER_1" },
    update: {},
    create: {
      id: "USER_1",
      name: "Test User",
      email: "test@utoto.com",
      phone_number: "0912345678",
      phone_code: "+84",
      isVerified: true,
    },
  });
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
  await prisma.trips.deleteMany({});
  await prisma.cars.deleteMany({});
  // We don't delete locations here as they are created per car, 
  // and deleting cars might leave orphaned locations if not handled by DB.
  // Actually, better to delete locations too to keep DB clean.
  await prisma.locations.deleteMany({});

  const getCarImage = (brand: string, model: string, index: number) => {
    // We use LoremFlickr for dynamic, keyword-based car images
    // Brand and model are used as tags to get the most relevant image
    const keywords = `car,${brand.replace(/\s+/g, '')},${model.replace(/\s+/g, '')}`;
    return `https://loremflickr.com/800/600/${keywords}/all?lock=${index}`;
  };

  const transmissionTypes = ["AUTOMATIC", "MANUAL"];
  const fuelTypes = ["GASOLINE", "DIESEL", "ELECTRIC"];

  // Fetch more districts for better location coverage
  const availableDistricts = await prisma.districts.findMany({
    include: { wards: true },
  });

  const brandsWithModels = brands.filter(b => b.car_models.length > 0);

  console.log("Generating 200 random cars...");

  for (let i = 1; i <= 200; i++) {
    // Random brand and model from brands that actually have models
    const randomBrand = brandsWithModels[Math.floor(Math.random() * brandsWithModels.length)];

    const randomModel =
      randomBrand.car_models[
      Math.floor(Math.random() * randomBrand.car_models.length)
      ];
    const randomImage = getCarImage(randomBrand.brand_name, randomModel.model_name, i);
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
        name: `${randomBrand.brand_name.toUpperCase()} ${randomModel.model_name.toUpperCase()} 202${Math.floor(Math.random() * 4) + 1}`,
        desc: "Xe chất lượng cao, bảo dưỡng định kỳ, sạch sẽ thoáng mát.",
        model_id: randomModel.model_id,
        transmission: transmission,
        seat: Math.random() > 0.8 ? 7 : 4,
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

async function main() {
  console.log("🌱 Seeding data...");

  await seedFeatures();
  await seedBrands();
  await seedModels();
  await seedUsers();
  await runSql(path.join(__dirname, "./data/IMPORT_DATA_VN_UNITS.sql"));
  await seedCars();

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
