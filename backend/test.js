// test.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const deliveries = await prisma.delivery.findMany({
    include: {
      order: true,
    },
  });

  console.log(deliveries);
}

main();