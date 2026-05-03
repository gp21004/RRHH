// archivo: backend/src/controllers/departamento.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const crearDepartamento = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevoDepto = await prisma.departamento.create({
            data: { nombre, descripcion }
        });

        res.status(201).json({ mensaje: 'Departamento creado', departamento: nuevoDepto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el departamento' });
    }
};

module.exports = { crearDepartamento };