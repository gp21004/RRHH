// archivo: backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando la siembra de datos de prueba...');

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

    // 2. Crear Empleados estratégicos
    await prisma.empleado.createMany({
        data: [
            {
                nombres: 'Carlos Eduardo',
                apellidos: 'López',
                dui: '11111111-1',
                salarioBase: 400.00, // Salario mínimo/bajo: NO aplica Renta.
                departamentoId: deptoVentas.id
            },
            {
                nombres: 'Ana Beatriz',
                apellidos: 'Martínez',
                dui: '22222222-2',
                salarioBase: 750.00, // Tramo 1 de Renta (10%).
                departamentoId: deptoAdmin.id
            },
            {
                nombres: 'Roberto Antonio',
                apellidos: 'Sánchez',
                dui: '33333333-3',
                salarioBase: 1500.00, // Tramo 2 de Renta (20%) y el ISSS debe topar a $30.
                departamentoId: deptoIT.id
            },
            {
                nombres: 'Elena Margarita',
                apellidos: 'Gómez',
                dui: '44444444-4',
                salarioBase: 2800.00, // Tramo 3 de Renta (30%) y el ISSS debe topar a $30.
                departamentoId: deptoAdmin.id
            }
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