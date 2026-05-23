// archivo: backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la siembra de datos de prueba...');

    // Limpiar base de datos antes de sembrar para evitar errores de duplicados
    await prisma.detallePlanilla.deleteMany();
    await prisma.planilla.deleteMany();
    await prisma.empleado.deleteMany();
    await prisma.departamento.deleteMany();
    await prisma.usuario.deleteMany();

    // 0. Crear Usuario Administrador por defecto
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    
    await prisma.usuario.create({
        data: {
            username: 'admin',
            password: passwordHash,
            nombreCompleto: 'Administrador del Sistema',
            correo: 'admin@gestionpro.com',
            rol: 'admin'
        }
    });

    // Crear usuario supervisor de prueba
    const passwordHashSup = await bcrypt.hash('super123', salt);
    await prisma.usuario.create({
        data: {
            username: 'supervisor',
            password: passwordHashSup,
            nombreCompleto: 'Supervisor General',
            correo: 'supervisor@gestionpro.com',
            rol: 'supervisor'
        }
    });

    console.log('👤 Usuarios creados: admin/admin123 y supervisor/super123');

    // 1. Crear Departamentos
    const deptoAdmin = await prisma.departamento.create({
        data: { nombre: 'Administración', descripcion: 'Gerencia y Recursos Humanos' }
    });

    const deptoIT = await prisma.departamento.create({
        data: { nombre: 'Tecnología', descripcion: 'Desarrollo de Software y Soporte' }
    });

    const deptoVentas = await prisma.departamento.create({
        data: { nombre: 'Ventas', descripcion: 'Ejecutivos comerciales y Marketing' }
    });

    const deptoOperaciones = await prisma.departamento.create({
        data: { nombre: 'Operaciones', descripcion: 'Logística y Distribución' }
    });

    const deptoFinanzas = await prisma.departamento.create({
        data: { nombre: 'Finanzas', descripcion: 'Contabilidad y Auditoría' }
    });

    // 2. Crear Empleados con sueldos variados para pruebas de planillas
    await prisma.empleado.createMany({
        data: [
            // Sueldos mínimos / Bajos (Sin renta)
            { nombres: 'Carlos Eduardo', apellidos: 'López', dui: '11111111-1', salarioBase: 400.00, departamentoId: deptoVentas.id },
            { nombres: 'María Luisa', apellidos: 'Pérez', dui: '11111111-2', salarioBase: 365.00, departamentoId: deptoOperaciones.id },
            { nombres: 'José Antonio', apellidos: 'Ramírez', dui: '11111111-3', salarioBase: 450.00, departamentoId: deptoVentas.id },
            
            // Tramo 1 Renta
            { nombres: 'Ana Beatriz', apellidos: 'Martínez', dui: '22222222-1', salarioBase: 750.00, departamentoId: deptoAdmin.id },
            { nombres: 'Luis Fernando', apellidos: 'García', dui: '22222222-2', salarioBase: 800.00, departamentoId: deptoOperaciones.id },
            { nombres: 'Carmen Elena', apellidos: 'Flores', dui: '22222222-3', salarioBase: 650.00, departamentoId: deptoFinanzas.id },
            { nombres: 'Jorge Alberto', apellidos: 'Cruz', dui: '22222222-4', salarioBase: 890.00, departamentoId: deptoIT.id },
            { nombres: 'Rosa Melida', apellidos: 'Reyes', dui: '22222222-5', salarioBase: 550.00, departamentoId: deptoVentas.id },

            // Tramo 2 Renta
            { nombres: 'Roberto Antonio', apellidos: 'Sánchez', dui: '33333333-1', salarioBase: 1500.00, departamentoId: deptoIT.id },
            { nombres: 'Claudia Patricia', apellidos: 'Mendoza', dui: '33333333-2', salarioBase: 1200.00, departamentoId: deptoFinanzas.id },
            { nombres: 'Mario Ernesto', apellidos: 'Rivas', dui: '33333333-3', salarioBase: 1800.00, departamentoId: deptoAdmin.id },
            { nombres: 'Teresa de Jesús', apellidos: 'Ortiz', dui: '33333333-4', salarioBase: 1350.00, departamentoId: deptoOperaciones.id },
            { nombres: 'Julio César', apellidos: 'Navarro', dui: '33333333-5', salarioBase: 1950.00, departamentoId: deptoIT.id },

            // Tramo 3 Renta (Altos ejecutivos)
            { nombres: 'Elena Margarita', apellidos: 'Gómez', dui: '44444444-1', salarioBase: 2800.00, departamentoId: deptoAdmin.id },
            { nombres: 'Ricardo Arturo', apellidos: 'Salazar', dui: '44444444-2', salarioBase: 2500.00, departamentoId: deptoFinanzas.id },
            { nombres: 'Mónica Lisseth', apellidos: 'Herrera', dui: '44444444-3', salarioBase: 3200.00, departamentoId: deptoIT.id },
            { nombres: 'Francisco Javier', apellidos: 'Morales', dui: '44444444-4', salarioBase: 4500.00, departamentoId: deptoAdmin.id },
            { nombres: 'Silvia Carolina', apellidos: 'Pineda', dui: '44444444-5', salarioBase: 2100.00, departamentoId: deptoVentas.id },
            { nombres: 'Oscar René', apellidos: 'Castillo', dui: '44444444-6', salarioBase: 5000.00, departamentoId: deptoIT.id }
        ]
    });

    console.log('✅ ¡Datos insertados con éxito! Ya puedes revisar tu sistema.');
}

main()
    .catch((e) => {
        console.error('❌ Error al insertar datos:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Cerramos la conexión a la base de datos al terminar
        await prisma.$disconnect();
    });