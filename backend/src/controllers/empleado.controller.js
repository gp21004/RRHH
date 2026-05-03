// archivo: backend/src/controllers/empleado.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearEmpleado = async (req, res) => {
    try {
        const { nombres, apellidos, dui, nit, nup_afp, salarioBase, departamentoId } = req.body;

        // Validamos que envíen los datos obligatorios
        if (!nombres || !apellidos || !dui || !salarioBase || !departamentoId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (nombres, apellidos, dui, salarioBase, departamentoId)' });
        }

        const nuevoEmpleado = await prisma.empleado.create({
            data: {
                nombres,
                apellidos,
                dui,
                nit,
                nup_afp,
                salarioBase,
                departamentoId
            }
        });

        res.status(201).json({ mensaje: 'Empleado salvadoreño registrado con éxito', empleado: nuevoEmpleado });
    } catch (error) {
        console.error(error);
        // P2002 es el código de error de Prisma cuando un campo @unique ya existe
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe un empleado registrado con ese DUI, NIT o NUP' });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear el empleado' });
    }
};

const obtenerEmpleados = async (req, res) => {
    try {
        // El "include" hace un JOIN automático para traer el nombre del departamento
        const empleados = await prisma.empleado.findMany({
            include: { departamento: true }
        });
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de empleados' });
    }
};

module.exports = { crearEmpleado, obtenerEmpleados };