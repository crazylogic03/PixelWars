import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GRID_SIZE = 40;

async function main() {
  const existingCount = await prisma.cell.count();

  if (existingCount > 0) {
    console.log(`Grid already seeded with ${existingCount} cells. Skipping.`);
    return;
  }

  console.log(`Seeding ${GRID_SIZE}x${GRID_SIZE} grid (${GRID_SIZE * GRID_SIZE} cells)...`);

  const cells: { row: number; column: number }[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      cells.push({ row, column: col });
    }
  }

  // Batch insert in chunks of 200 for performance
  const BATCH_SIZE = 200;
  for (let i = 0; i < cells.length; i += BATCH_SIZE) {
    const batch = cells.slice(i, i + BATCH_SIZE);
    await prisma.cell.createMany({ data: batch });
    console.log(`  Seeded ${Math.min(i + BATCH_SIZE, cells.length)} / ${cells.length} cells`);
  }

  console.log("✅ Grid seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
