const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generarPlanillaMensual = async (req, res) => {
  try {
    const contratos = await prisma.contrato.findMany({
      where: {
        estado: 'Activo'
      },
      include: {
        empleado: true
      }
    });

    console.log('Contratos encontrados:');
    console.log(contratos);

    const planillaCalculada = contratos.map((contrato) => {
      const salario = Number(contrato.salarioContratado);

      // ISSS (3% con tope de $30)
      let isss =
        salario > 1000
          ? 30
          : Number((salario * 0.03).toFixed(2));

      // AFP (7.25%)
      let afp = Number((salario * 0.0725).toFixed(2));

      // Base gravable
      const rentaImponible = Number(
        (salario - isss - afp).toFixed(2)
      );

      // ISR
      let isr = 0;

      if (rentaImponible > 550 && rentaImponible <= 895.24) {
        isr =
          ((rentaImponible - 550) * 0.10) + 17.67;
      } else if (
        rentaImponible > 895.24 &&
        rentaImponible <= 2038.10
      ) {
        isr =
          ((rentaImponible - 895.24) * 0.20) + 60;
      } else if (rentaImponible > 2038.10) {
        isr =
          ((rentaImponible - 2038.10) * 0.30) + 288.57;
      }

      isr = Number(isr.toFixed(2));

      // Salario líquido
      const salarioLiquido = Number(
        (salario - isss - afp - isr).toFixed(2)
      );

      return {
        empleadoId: contrato.empleado.id,
        contratoId: contrato.id,

        empleadoNombre: `${contrato.empleado.nombres} ${contrato.empleado.apellidos}`,

        salarioBase: salario,

        isss,
        afp,
        renta: isr,

        salarioLiquido
      };
    });

    res.status(200).json(planillaCalculada);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
};

const guardarPlanillaHistorial = async (req, res) => {
  const { mes, anio, detalles } = req.body;

  try {
    const planillaExistente =
      await prisma.planilla.findFirst({
        where: {
          mes,
          anio
        }
      });

    if (planillaExistente) {
      return res.status(400).json({
        error: `La planilla de ${mes} ${anio} ya fue generada`
      });
    }

    const nuevaPlanilla =
      await prisma.planilla.create({
        data: {
          mes,
          anio,
          tipo: 'Mensual',
          estado: 'Pagada',

          detalles: {
            create: detalles.map((det) => ({
              empleadoId: det.empleadoId,
              contratoId: det.contratoId,
              empleadoNombre: det.empleadoNombre,

              salarioContratado: det.salarioBase,

              isss: det.isss,
              afp: det.afp,
              renta: det.renta,

              salarioLiquido: det.salarioLiquido
            }))
          }
        }
      });

    res.status(201).json(nuevaPlanilla);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Error al guardar el historial'
    });
  }
};

// Obtener lista de todas las planillas guardadas
const obtenerHistorial = async (req, res) => {
  try {
    const historial =
      await prisma.planilla.findMany({
        orderBy: {
          fechaGeneracion: 'desc'
        }
      });

    res.status(200).json(historial);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// Obtener una planilla específica con sus detalles
const obtenerDetalleHistorial = async (req, res) => {
  const { id } = req.params;

  try {
    const planilla =
      await prisma.planilla.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          detalles: true
        }
      });

    res.status(200).json(planilla);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
const obtenerDetalleEmpleadoPlanilla = async (req, res) => {
  try {
    const { planillaId, empleadoId } = req.params

    const detalle = await prisma.detallePlanilla.findFirst({
      where: {
        planillaId: Number(planillaId),
        empleadoId: Number(empleadoId)
      },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        },
        contrato: true,
        planilla: true
      }
    })

    if (!detalle) {
      return res.status(404).json({
        error: 'No se encontró el detalle del empleado'
      })
    }

    res.status(200).json({
      id: detalle.id,

      nombre: detalle.empleadoNombre,

      cargo: detalle.contrato?.cargo || '',

      departamento:
        detalle.empleado?.departamento?.nombre || '',

      periodo:
        `${detalle.planilla.mes} ${detalle.planilla.anio}`,

      cedula: detalle.empleado?.dui || '',

      email: detalle.empleado?.correo || '',

      telefono: detalle.empleado?.telefono || '',

      salarioBase: Number(detalle.salarioContratado),

      isss: Number(detalle.isss),

      afp: Number(detalle.afp),

      isr: Number(detalle.renta),

      netoAPagar: Number(detalle.salarioLiquido),

      fechaGeneracion: detalle.planilla.fechaGeneracion
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: error.message
    })
  }
}

module.exports = {
  generarPlanillaMensual,
  guardarPlanillaHistorial,
  obtenerHistorial,
  obtenerDetalleHistorial,
  obtenerDetalleEmpleadoPlanilla
};