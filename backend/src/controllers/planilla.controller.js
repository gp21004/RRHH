const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generarPlanillaMensual = async (req, res) => {
    try {
        const empleados = await prisma.empleado.findMany();
        const planillaCalculada = empleados.map(emp => {
            const salario = Number(emp.salarioBase);
            let isss = salario > 1000 ? 30.00 : salario * 0.03;
            let afp = salario * 0.0725;
            let rentaImponible = salario - isss - afp;
            let isr = 0;

            if (rentaImponible > 472.00 && rentaImponible <= 895.24) isr = ((rentaImponible - 472.00) * 0.10) + 17.67;
            else if (rentaImponible > 895.24 && rentaImponible <= 2038.10) isr = ((rentaImponible - 895.24) * 0.20) + 60.00;
            else if (rentaImponible > 2038.10) isr = ((rentaImponible - 2038.10) * 0.30) + 288.57;

            return {
                empleadoId: emp.id, // <-- Importante para tu nueva relación en Prisma
                empleadoNombre: `${emp.nombres} ${emp.apellidos}`,
                salarioBase: salario,
                isss: isss,
                afp: afp,
                renta: isr,
                salarioLiquido: (salario - isss - afp - isr)
            };
        });
        res.status(200).json(planillaCalculada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const guardarPlanillaHistorial = async (req, res) => {
    const { mes, anio, detalles } = req.body;
    try {
        const nuevaPlanilla = await prisma.planilla.create({
            data: {
                mes,
                anio,
                tipo: "Mensual",
                estado: "Pagada",
                detalles: {
                    create: detalles // Prisma creará automáticamente todos los registros en DetallePlanilla
                }
            }
        });
        res.status(201).json(nuevaPlanilla);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el historial' });
    }
};

module.exports = { generarPlanillaMensual, guardarPlanillaHistorial };