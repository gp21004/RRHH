const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// TIPOS DE CONTRATO (control estricto)
// ─────────────────────────────────────────────────────────────

const TIPOS_SERVICIOS_PROFESIONALES = [
  'servicios profesionales',
  'consultoría'
];

const esServiciosProfesionales = (tipoContrato = '') => {
  return TIPOS_SERVICIOS_PROFESIONALES.includes(
    tipoContrato.trim().toLowerCase()
  );
};

// ─────────────────────────────────────────────────────────────
// CÁLCULO DE DESCUENTOS
// ─────────────────────────────────────────────────────────────

const calcularDescuentos = (salario, tipoContrato) => {
  if (esServiciosProfesionales(tipoContrato)) {
    const isr = Number((salario * 0.10).toFixed(2));
    const salarioLiquido = Number((salario - isr).toFixed(2));

    return {
      isss: 0,
      afp: 0,
      isr,
      salarioLiquido
    };
  }

  // ── CONTRATO NORMAL ─────────────────────────────

  const isss = salario > 1000
    ? 30
    : Number((salario * 0.03).toFixed(2));

  const afp = Number((salario * 0.0725).toFixed(2));

  const rentaImponible = Number((salario - isss - afp).toFixed(2));

  let isr = 0;

  if (rentaImponible > 550 && rentaImponible <= 895.24) {
    isr = ((rentaImponible - 550) * 0.10) + 17.67;
  } else if (rentaImponible > 895.24 && rentaImponible <= 2038.10) {
    isr = ((rentaImponible - 895.24) * 0.20) + 60;
  } else if (rentaImponible > 2038.10) {
    isr = ((rentaImponible - 2038.10) * 0.30) + 288.57;
  }

  isr = Number(isr.toFixed(2));

  const salarioLiquido = Number(
    (salario - isss - afp - isr).toFixed(2)
  );

  return {
    isss,
    afp,
    isr,
    salarioLiquido
  };
};

// ─────────────────────────────────────────────────────────────
// GENERAR PLANILLA
// ─────────────────────────────────────────────────────────────

const generarPlanillaMensual = async (req, res) => {
  try {
    const contratos = await prisma.contrato.findMany({
      where: { estado: 'Activo' },
      include: { empleado: true }
    });

    const planillaCalculada = contratos.map((contrato) => {
      const salario = Number(contrato.salarioContratado);
      const tipo = contrato.tipoContrato || '';

      const { isss, afp, isr, salarioLiquido } =
        calcularDescuentos(salario, tipo);

      return {
        empleadoId: contrato.empleado.id,
        contratoId: contrato.id,
        tipoContrato: tipo,
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
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GUARDAR HISTORIAL PLANILLA
// ─────────────────────────────────────────────────────────────

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

    const nuevosDetalles = [];

    for (const det of detalles) {
      const existe = await prisma.detallePlanilla.findFirst({
        where: {
          planillaId: planilla.id,
          empleadoId: det.empleadoId
        }
      });

      if (!existe) {
        let contratoId =
          det.contratoId && det.contratoId > 0
            ? det.contratoId
            : null;

        if (!contratoId) {
          const contrato = await prisma.contrato.findFirst({
            where: {
              empleadoId: det.empleadoId,
              estado: { in: ['Vigente', 'Activo'] }
            },
            orderBy: { fechaInicio: 'desc' }
          });

          if (!contrato) {
            const fallback = await prisma.contrato.findFirst({
              where: { empleadoId: det.empleadoId },
              orderBy: { fechaInicio: 'desc' }
            });

            contratoId = fallback?.id;
          } else {
            contratoId = contrato.id;
          }
        }

        if (!contratoId) continue;

        nuevosDetalles.push({
          planillaId: planilla.id,
          empleadoId: det.empleadoId,
          contratoId,
          empleadoNombre: det.empleadoNombre,
          salarioContratado: det.salarioBase,
          isss: det.isss ?? 0,
          afp: det.afp ?? 0,
          renta: det.renta ?? 0,
          salarioLiquido: det.salarioLiquido
        });
      }
    }

    if (nuevosDetalles.length > 0) {
      await prisma.detallePlanilla.createMany({
        data: nuevosDetalles
      });
    }

    res.status(201).json({
      message: 'Planilla actualizada exitosamente',
      planilla
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al guardar el historial'
    });
  }
};

// ─────────────────────────────────────────────────────────────
// VERIFICAR PAGOS
// ─────────────────────────────────────────────────────────────

const verificarPagos = async (req, res) => {
  try {
    const { mes, anio } = req.params;

    const mesesNombres = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
    ];

    const mesNumero = parseInt(mes);
    const mesNombre =
      mesNumero >= 1 && mesNumero <= 12
        ? mesesNombres[mesNumero - 1]
        : mes;

    const planilla = await prisma.planilla.findFirst({
      where: { mes: mesNombre, anio: parseInt(anio) },
      include: { detalles: true }
    });

    if (!planilla) return res.json([]);

    const empleadosPagados = planilla.detalles.map(d => d.empleadoId);
    res.json(empleadosPagados);

  } catch (error) {
    res.status(500).json({ error: 'Error al verificar pagos' });
  }
};

// ─────────────────────────────────────────────────────────────
// HISTORIAL
// ─────────────────────────────────────────────────────────────

const obtenerHistorial = async (req, res) => {
  try {
    const historial = await prisma.planilla.findMany({
      include: {
        detalles: {
          include: {
            empleado: {
              include: { departamento: true }
            }
          }
        }
      },
      orderBy: { fechaGeneracion: 'desc' }
    });

    res.status(200).json(historial);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DETALLE PLANILLA
// ─────────────────────────────────────────────────────────────

const obtenerDetalleHistorial = async (req, res) => {
  const { id } = req.params;

  try {
    const planilla = await prisma.planilla.findUnique({
      where: { id: parseInt(id) },
      include: { detalles: true }
    });

    res.status(200).json(planilla);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DETALLE EMPLEADO
// ─────────────────────────────────────────────────────────────

const obtenerDetalleEmpleadoPlanilla = async (req, res) => {
  try {
    const { planillaId, empleadoId } = req.params;

    const detalle = await prisma.detallePlanilla.findFirst({
      where: {
        planillaId: Number(planillaId),
        empleadoId: Number(empleadoId)
      },
      include: {
        empleado: { include: { departamento: true } },
        contrato: true,
        planilla: true
      }
    });

    if (!detalle) {
      return res.status(404).json({
        error: 'No se encontró el detalle del empleado'
      });
    }

    res.status(200).json({
      id: detalle.id,
      nombre: detalle.empleadoNombre,
      cargo: detalle.contrato?.cargo || '',
      departamento: detalle.empleado?.departamento?.nombre || '',
      periodo: `${detalle.planilla.mes} ${detalle.planilla.anio}`,
      cedula: detalle.empleado?.dui || '',
      email: detalle.empleado?.correo || '',
      telefono: detalle.empleado?.telefono || '',
      salarioBase: Number(detalle.salarioContratado),
      isss: Number(detalle.isss ?? 0),
      afp: Number(detalle.afp ?? 0),
      isr: Number(detalle.renta ?? 0),
      netoAPagar: Number(detalle.salarioLiquido),
      fechaGeneracion: detalle.planilla.fechaGeneracion
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    const planillas = await prisma.planilla.findMany({
      include: { detalles: true },
      orderBy: { fechaGeneracion: 'desc' }
    });

    const totalPagado = planillas.reduce(
      (t, p) => t + p.detalles.reduce(
        (s, d) => s + Number(d.salarioLiquido), 0
      ), 0
    );

    const totalISSS = planillas.reduce(
      (t, p) => t + p.detalles.reduce(
        (s, d) => s + (d.isss ?? 0), 0
      ), 0
    );

    const totalAFP = planillas.reduce(
      (t, p) => t + p.detalles.reduce(
        (s, d) => s + (d.afp ?? 0), 0
      ), 0
    );

    const totalRenta = planillas.reduce(
      (t, p) => t + p.detalles.reduce(
        (s, d) => s + (d.renta ?? 0), 0
      ), 0
    );

    const ultimaPlanilla = planillas[0];

    let resumenMes = null;

    if (ultimaPlanilla) {
      resumenMes = {
        mes: ultimaPlanilla.mes,
        anio: ultimaPlanilla.anio,
        totalPagado: ultimaPlanilla.detalles.reduce(
          (s, d) => s + Number(d.salarioLiquido), 0
        ),
        isss: ultimaPlanilla.detalles.reduce(
          (s, d) => s + (d.isss ?? 0), 0
        ),
        afp: ultimaPlanilla.detalles.reduce(
          (s, d) => s + (d.afp ?? 0), 0
        ),
        renta: ultimaPlanilla.detalles.reduce(
          (s, d) => s + (d.renta ?? 0), 0
        )
      };
    }

    res.json({
      totalPagado,
      totalISSS,
      totalAFP,
      totalRenta,
      resumenMes
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────

module.exports = {
  generarPlanillaMensual,
  guardarPlanillaHistorial,
  obtenerHistorial,
  obtenerDetalleHistorial,
  obtenerDetalleEmpleadoPlanilla,
  obtenerEstadisticasDashboard,
  verificarPagos
};