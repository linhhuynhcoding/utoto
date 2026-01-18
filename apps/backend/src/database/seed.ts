import fs from "fs";
import path from "path";
import prisma from ".";


async function runSql(file: string) {
  const sql = fs.readFileSync(file, 'utf8')
  await prisma.$executeRawUnsafe(sql)
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

async function main() {
  console.log("🌱 Seeding data...");

  await seedFeatures();
  await seedBrands();
  await runSql(path.join(__dirname, './data/IMPORT_DATA_VN_UNITS.sql'))


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
