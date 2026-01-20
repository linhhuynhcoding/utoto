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

async function main() {
  console.log("🌱 Seeding data...");

  await seedFeatures();
  await seedBrands();
  await seedModels();
  await runSql(path.join(__dirname, "./data/IMPORT_DATA_VN_UNITS.sql"));

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
