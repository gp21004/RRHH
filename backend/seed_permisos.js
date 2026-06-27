const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const modulosDisponibles = [
  { id: 'dashboard', nombre: 'Dashboard' },
  { id: 'contratacion', nombre: 'Contratación y Personal' },
  { id: 'planillas', nombre: 'Generación de Planillas' },
  { id: 'historial', nombre: 'Historial de Planillas' },
  { id: 'transacciones', nombre: 'Transacciones' },
  { id: 'contratos', nombre: 'Gestión de Contratos' },
  { id: 'configuracion', nombre: 'Configuración del Sistema' },
  { id: 'gestion-pagos', nombre: 'Gestión de Pagos' }
];

async function main() {
  console.log('Seeding permisos...');
  for (const modulo of modulosDisponibles) {
    await prisma.permiso.upsert({
      where: { id: modulo.id },
      update: { nombre: modulo.nombre },
      create: { id: modulo.id, nombre: modulo.nombre }
    });
  }
  console.log('Permisos insertados correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
