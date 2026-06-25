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
    let planilla = await prisma.planilla.findFirst({
      where: { mes, anio }
    });

    if (!planilla) {
      planilla = await prisma.planilla.create({
        data: {
          mes,
          anio,
          tipo: 'Mensual',
          estado: 'Pagada'
        }
      });
    }

    // Insertar solo los detalles que no existan para este empleado en esta planilla
    const nuevosDetalles = [];
    for (const det of detalles) {
      const existe = await prisma.detallePlanilla.findFirst({
        where: {
          planillaId: planilla.id,
          empleadoId: det.empleadoId
        }
      });
      if (!existe) {
        // Resolver el contratoId: buscar el contrato vigente si no viene o viene inválido
        let contratoId = (det.contratoId && det.contratoId > 0) ? det.contratoId : null

        if (!contratoId) {
          const contrato = await prisma.contrato.findFirst({
            where: {
              empleadoId: det.empleadoId,
              estado: { in: ['Vigente', 'Activo'] }
            },
            orderBy: { fechaInicio: 'desc' }
          })
          if (!contrato) {
            // Último recurso: cualquier contrato del empleado
            const cualquierContrato = await prisma.contrato.findFirst({
              where: { empleadoId: det.empleadoId },
              orderBy: { fechaInicio: 'desc' }
            })
            contratoId = cualquierContrato?.id
          } else {
            contratoId = contrato.id
          }
        }

        if (!contratoId) {
          console.warn(`No se encontró contrato para empleadoId ${det.empleadoId}, omitiendo`)
          continue
        }

        nuevosDetalles.push({
          planillaId: planilla.id,
          empleadoId: det.empleadoId,
          contratoId,
          empleadoNombre: det.empleadoNombre,
          salarioContratado: det.salarioBase,
          isss: det.isss,
          afp: det.afp,
          renta: det.renta,
          salarioLiquido: det.salarioLiquido
        });
      }
    }

    if (nuevosDetalles.length > 0) {
      await prisma.detallePlanilla.createMany({
        data: nuevosDetalles
      });
    }

    res.status(201).json({ message: 'Planilla actualizada exitosamente', planilla });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el historial' });
  }
};

const verificarPagos = async (req, res) => {
  try {
    const { mes, anio } = req.params;
    const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    
    // Si mes llega como número (ej: "6"), convertirlo a nombre ("Junio")
    const mesNumero = parseInt(mes)
    const mesNombre = (mesNumero >= 1 && mesNumero <= 12) 
      ? mesesNombres[mesNumero - 1] 
      : mes  // Si ya viene como texto, usarlo directamente

    const planilla = await prisma.planilla.findFirst({
      where: { mes: mesNombre, anio: parseInt(anio) },
      include: { detalles: true }
    });

    if (!planilla) {
      return res.json([]);
    }

    const empleadosPagados = planilla.detalles.map(d => d.empleadoId);
    res.json(empleadosPagados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar pagos' });
  }
};

// Obtener lista de todas las planillas guardadas
const obtenerHistorial = async (req, res) => {
  try {
    const historial =
      await prisma.planilla.findMany({
        include: {
          detalles: true
        },
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
const obtenerEstadisticasDashboard = async (req, res) => {
  try {

    const planillas = await prisma.planilla.findMany({
      include: {
        detalles: true
      },  
      orderBy: {
        fechaGeneracion: 'desc'
      }
    })

    const totalPagado = planillas.reduce((total, planilla) => {
      return total + planilla.detalles.reduce(
        (suma, det) => suma + Number(det.salarioLiquido),
        0
      )
    }, 0)

    const totalISSS = planillas.reduce((total, planilla) => {
      return total + planilla.detalles.reduce(
        (suma, det) => suma + Number(det.isss),
        0
      )
    }, 0)

    const totalAFP = planillas.reduce((total, planilla) => {
      return total + planilla.detalles.reduce(
        (suma, det) => suma + Number(det.afp),
        0
      )
    }, 0)

    const totalRenta = planillas.reduce((total, planilla) => {
      return total + planilla.detalles.reduce(
        (suma, det) => suma + Number(det.renta),
        0
      )
    }, 0)

    const ultimaPlanilla = planillas[0]

    let resumenMes = null

    if (ultimaPlanilla) {
      resumenMes = {
        mes: ultimaPlanilla.mes,
        anio: ultimaPlanilla.anio,

        totalPagado: ultimaPlanilla.detalles.reduce(
          (suma, d) => suma + Number(d.salarioLiquido),
          0
        ),

        isss: ultimaPlanilla.detalles.reduce(
          (suma, d) => suma + Number(d.isss),
          0
        ),

        afp: ultimaPlanilla.detalles.reduce(
          (suma, d) => suma + Number(d.afp),
          0
        ),

        renta: ultimaPlanilla.detalles.reduce(
          (suma, d) => suma + Number(d.renta),
          0
        )
      }
    }

    res.json({
      totalPagado,
      totalISSS,
      totalAFP,
      totalRenta,
      resumenMes
    })

  } catch (error) {
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
  obtenerDetalleEmpleadoPlanilla,
  obtenerEstadisticasDashboard,
  verificarPagos
};