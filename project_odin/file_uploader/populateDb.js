import { prisma } from "./lib/prisma.js";

async function main() {
const folders = await prisma.folder.createMany({
    data: [
        { parent: 3 },
        { parent: 3 },
        { parent: 3 },
        { parent: 3 },
        { parent: 3 },
        { parent: 6 },
        { parent: 6 },
        { parent: 6 },
        { parent: 6 },
        { parent: 10 }
    ],
    });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
