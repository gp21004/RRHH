const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const { generarContratoPDF } = require('../services/contratoPdf.service');

const prisma = new PrismaClient();

/**
 * OBTENER TODOS LOS CONTRATOS
 */
const obtenerContratos = async (req, res) => {
  try {
    const contratos = await prisma.contrato.findMany({
      include: {
        empleado: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const data = contratos.map(c => {
      const formatDate = (d) => {
        if (!d) return '';
        const dt = new Date(d);
        return dt.toISOString().split('T')[0];
      };

      return {
        id: c.id,
        empleadoId: c.empleadoId,
        empleado: `${c.empleado.nombres} ${c.empleado.apellidos}`,
        tipoContrato: c.tipoContrato,
        fechaInicio: formatDate(c.fechaInicio),
        fechaFin: formatDate(c.fechaFin),
        salarioContratado: c.salarioContratado,
        estado: c.estado,
        cargo: c.cargo,
        jornada: c.jornada,
        horario: c.horario,
        horaInicio: c.horaEntradaEsperada || '',
        horaFin: c.horaSalidaEsperada || '',
        diasLaborales: c.diasLaborales,
        periodoPrueba: c.periodoPrueba,
        clausulas: c.clausulas,
        firma: 'PDF'
      };
    });

    res.json(data);

  } catch (error) {
    console.error('Error obteniendo contratos:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * CREAR NUEVO CONTRATO
 */
const crearContrato = async (req, res) => {
  try {
    const {
      empleadoId,
      tipoContrato,
      cargo,
      fechaInicio,
      fechaFin,
      salarioContratado,
      jornada,
      horario,
      horaInicio,
      horaFin,
      diasLaborales,
      periodoPrueba,
      clausulas
    } = req.body;

    // Validar si ya tiene contrato activo
    const contratoActivo = await prisma.contrato.findFirst({
      where: {
        empleadoId: empleadoId,
        estado: 'Activo'
      }
    });

    if (contratoActivo) {
      return res.status(400).json({
        message: 'El empleado ya tiene un contrato activo'
      });
    }

    // Crear contrato
    const contrato = await prisma.contrato.create({
      data: {
        empleadoId,
        tipoContrato,
        cargo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        salarioContratado,
        horaEntradaEsperada: horaInicio || '08:00',
        horaSalidaEsperada: horaFin || '17:00',
        diasLaborales,
        periodoPrueba,
        clausulas,
        estado: 'Borrador'
      }
    });

    res.status(201).json(contrato);

  } catch (error) {
    console.error('Error creando contrato:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * ACTUALIZAR CONTRATO
 */
const actualizarContrato = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      empleadoId,
      tipoContrato,
      cargo,
      fechaInicio,
      fechaFin,
      salarioContratado,
      jornada,
      horario,
      horaInicio,
      horaFin,
      diasLaborales,
      periodoPrueba,
      clausulas,
      estado
    } = req.body;

    const contrato = await prisma.contrato.update({
      where: {
        id: Number(id)
      },
      data: {
        ...(empleadoId !== undefined && { empleadoId }),
        ...(tipoContrato !== undefined && { tipoContrato }),
        ...(cargo !== undefined && { cargo }),
        ...(fechaInicio !== undefined && { fechaInicio: new Date(fechaInicio) }),
        ...(fechaFin !== undefined && {
          fechaFin: fechaFin ? new Date(fechaFin) : null
        }),
        ...(salarioContratado !== undefined && { salarioContratado }),
        ...(horaInicio !== undefined && { horaEntradaEsperada: horaInicio }),
        ...(horaFin !== undefined && { horaSalidaEsperada: horaFin }),
        ...(diasLaborales !== undefined && { diasLaborales }),
        ...(periodoPrueba !== undefined && { periodoPrueba }),
        ...(clausulas !== undefined && { clausulas }),
        ...(estado !== undefined && { estado })
      }
    });

    res.json(contrato);

  } catch (error) {
    console.error('Error actualizando contrato:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * OBTENER UN CONTRATO POR ID
 */
const obtenerContratoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        }
      }
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    res.json(contrato);

  } catch (error) {
    console.error('Error obteniendo contrato:', error);
    res.status(500).json({
      error: error.message
    });
  }
};

/**
 * GENERAR PDF DEL CONTRATO (VERSIÓN PROFESIONAL)
 * 
 * Esta función genera un PDF profesional con formato formal, tabla de datos,
 * cláusulas bien estructuradas, sección de firmas y marca de agua.
 */
const generarContratoPDFDescarga = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener contrato con datos del empleado y departamento
    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        }
      }
    });

    if (!contrato) {
      return res.status(404).json({ 
        message: 'Contrato no encontrado',
        statusCode: 404 
      });
    }

    // Llamar al servicio de generación de PDF profesional
    await generarContratoPDF(contrato, res);

  } catch (error) {
    console.error('Error generando PDF del contrato:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Error al generar el PDF del contrato'
    });
  }
};

/**
 * GENERAR PDF PREVIEW (Antes de finalizar)
 * 
 * Esta función genera un PDF de borrador para previsualización antes de finalizar el contrato.
 */
const generarPDFPreview = async (req, res) => {
  try {
    const data = req.body;

    const doc = new PDFDocument({ 
      margin: 50, 
      size: 'A4',
      info: {
        Title: 'Preview Contrato Individual de Trabajo',
        Author: 'Sistema de Gestión RRHH'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=preview_contrato_${new Date().getTime()}.pdf`);

    doc.pipe(res);

    // Encabezado
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#1F2937')
      .text('CONTRATO DE TRABAJO (BORRADOR)', {
        align: 'center'
      });

    doc.moveDown(0.5);

    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#F59E0B')
      .text('⚠️ Este es un documento de previsualización. No es un documento final.', {
        align: 'center'
      });

    doc.moveDown(1);

    // Mostrar datos en formato legible
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#1F2937')
      .text('DATOS INGRESADOS:', { underline: true });

    doc.moveDown(0.3);

    // Formatear y mostrar los datos del body
    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== '') {
        const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

        doc.fontSize(9)
          .font('Helvetica-Bold')
          .fillColor('#374151')
          .text(`${capitalizedLabel}:`, { continued: true });

        doc.font('Helvetica')
          .fillColor('#4B5563')
          .text(` ${value}`);
      }
    });

    doc.end();

  } catch (error) {
    console.error('Error generando preview del PDF:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Error al generar el preview del PDF'
    });
  }
};

/**
 * ELIMINAR CONTRATO
 */
const eliminarContrato = async (req, res) => {
  try {
    const { id } = req.params;

    const contrato = await prisma.contrato.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({ 
      message: 'Contrato eliminado exitosamente',
      contrato 
    });

  } catch (error) {
    console.error('Error eliminando contrato:', error);
    res.status(500).json({
      error: error.message,
      message: 'Error al eliminar el contrato'
    });
  }
};

/**
 * CAMBIAR ESTADO DEL CONTRATO
 */
const cambiarEstadoContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['Borrador', 'Activo', 'Inactivo', 'Finalizado'].includes(estado)) {
      return res.status(400).json({
        message: 'Estado inválido. Estados válidos: Borrador, Activo, Inactivo, Finalizado'
      });
    }

    const contrato = await prisma.contrato.update({
      where: { id: Number(id) },
      data: { estado }
    });

    res.json({ 
      message: `Contrato actualizado a estado: ${estado}`,
      contrato 
    });

  } catch (error) {
    console.error('Error cambiando estado del contrato:', error);
    res.status(500).json({
      error: error.message,
      message: 'Error al cambiar el estado del contrato'
    });
  }
};

module.exports = {
  obtenerContratos,
  crearContrato,
  actualizarContrato,
  obtenerContratoPorId,
  generarContratoPDFDescarga,
  generarPDFPreview,
  eliminarContrato,
  cambiarEstadoContrato
};
