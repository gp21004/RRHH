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
  console.log('Iniciando sembrado de Roles y Permisos...');

  // 1. Insertar todos los permisos en la tabla Permiso
  for (const modulo of modulosDisponibles) {
    await prisma.permiso.upsert({
      where: { id: modulo.id },
      update: { nombre: modulo.nombre },
      create: { id: modulo.id, nombre: modulo.nombre },
    });
  }
  console.log('✅ Permisos básicos insertados/actualizados.');

  // 2. Crear el Rol Administrador (por defecto) si no existe
  let rolAdmin = await prisma.rol.findUnique({
    where: { nombre: 'Administrador' }
  });

  if (!rolAdmin) {
    rolAdmin = await prisma.rol.create({
      data: {
        nombre: 'Administrador',
        descripcion: 'Acceso total al sistema',
        isDefault: true,
      }
    });
    console.log('✅ Rol "Administrador" creado.');
  } else {
    console.log('ℹ️ Rol "Administrador" ya existe.');
  }

  // 3. Asignar TODOS los permisos al Rol Administrador
  // Primero eliminamos los permisos actuales del rol para evitar duplicados si los módulos cambiaron
  await prisma.rolPermiso.deleteMany({
    where: { rolId: rolAdmin.id }
  });

  // Insertamos las nuevas relaciones
  const permisosAdmin = modulosDisponibles.map(modulo => ({
    rolId: rolAdmin.id,
    permisoId: modulo.id
  }));

  await prisma.rolPermiso.createMany({
    data: permisosAdmin
  });
  console.log('✅ Permisos asignados al Rol "Administrador".');

  // 4. Crear un Rol de RRHH como ejemplo (si quieres, u omitir)
  let rolRRHH = await prisma.rol.findUnique({
    where: { nombre: 'Recursos Humanos' }
  });

  if (!rolRRHH) {
    rolRRHH = await prisma.rol.create({
      data: {
        nombre: 'Recursos Humanos',
        descripcion: 'Gestión de personal y planillas.',
        isDefault: false,
      }
    });
    
    // Permisos para RRHH
    const permisosRRHH = ['dashboard', 'contratacion', 'planillas', 'contratos'].map(id => ({
      rolId: rolRRHH.id,
      permisoId: id
    }));
    await prisma.rolPermiso.createMany({ data: permisosRRHH });
    console.log('✅ Rol "Recursos Humanos" creado con permisos básicos.');
  } else {
    console.log('ℹ️ Rol "Recursos Humanos" ya existe.');
  }

  // 5. Asignar el Rol Administrador al primer usuario (o a todos los usuarios sin rol para no romper nada)
  const usuariosSinRol = await prisma.usuario.findMany({
    where: { rolId: null }
  });

  if (usuariosSinRol.length > 0) {
    for (const usuario of usuariosSinRol) {
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { rolId: rolAdmin.id }
      });
    }
    console.log(`✅ Rol Administrador asignado a ${usuariosSinRol.length} usuarios existentes.`);
  } else {
    console.log('ℹ️ No hay usuarios sin rol.');
  }

  console.log('🎉 Sembrado completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
