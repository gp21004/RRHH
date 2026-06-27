const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.usuario.findUnique({
    where: { username: 'admin' },
    include: { rol: true }
  });
  console.log("Admin user:", JSON.stringify(adminUser, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
