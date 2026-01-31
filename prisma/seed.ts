import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const COLLECTIONS = [
  "VENICE CARNIVAL",
  "AFRICAN BEAUTY",
  "TIFLIS-TBILISI LOVES YOU",
  "GEISHA",
  "DECORATED",
  "ARISTOCAT",
  "MR. and MRS.Dog",
  "TBILISI",
  "PORTRAIT",
  "ANIMALS",
  "HORSES",
  "QUEEN",
  "GEORGIAN",
];

async function main() {
  for (let i = 0; i < COLLECTIONS.length; i++) {
    await prisma.collection.upsert({
      where: { name: COLLECTIONS[i] },
      update: { order: i + 1 },
      create: { name: COLLECTIONS[i], order: i + 1 },
    });
  }
  console.log(`Seeded ${COLLECTIONS.length} collections.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
