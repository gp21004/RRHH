  const { PrismaClient } = require('@prisma/client')

  const prisma = new PrismaClient()

  // OBTENER CONTRATOS
  const obtenerContratos = async (req, res) => {

    try {

      const contratos = await prisma.contrato.findMany({
        include: {
          empleado: true
        },
        orderBy: {
          id: 'desc'
        }
      })

      const data = contratos.map(c => ({
        id: c.id,
        empleadoId: c.empleadoId,
        empleado: `${c.empleado.nombres} ${c.empleado.apellidos}`,
        tipoContrato: c.tipoContrato,
        fechaInicio: c.fechaInicio,
        fechaFin: c.fechaFin || '',
        salarioContratado: c.salarioContratado,
        estado: c.estado,
        cargo: c.cargo,
        jornada: c.jornada,
        horario: c.horario,
        diasLaborales: c.diasLaborales,
        periodoPrueba: c.periodoPrueba,
        clausulas: c.clausulas,
        firma: 'PDF'
      }))

      res.json(data)

    } catch (error) {

      console.error(error)

      res.status(500).json({
        error: error.message
      })
    }
  }


  // CREAR CONTRATO
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
      diasLaborales,
      periodoPrueba,
      clausulas
    } = req.body

    // VALIDAR SI YA TIENE CONTRATO ACTIVO
    const contratoActivo = await prisma.contrato.findFirst({
      where: {
        empleadoId: empleadoId,
        estado: 'Activo'
      }
    })

    if (contratoActivo) {
      return res.status(400).json({
        message: 'El empleado ya tiene un contrato activo'
      })
    }

    // CREAR CONTRATO
    const contrato = await prisma.contrato.create({
      data: {
        empleadoId,
        tipoContrato,
        cargo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        salarioContratado,
        jornada,
        horario,
        diasLaborales,
        periodoPrueba,
        clausulas,
        estado: 'Borrador'
      }
    })

    res.status(201).json(contrato)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: error.message
    })
  }
}

 // ACTUALIZAR CONTRATO
const actualizarContrato = async (req, res) => {

  try {

    const { id } = req.params

    const {
      empleadoId,
      tipoContrato,
      cargo,
      fechaInicio,
      fechaFin,
      salarioContratado,
      jornada,
      horario,
      diasLaborales,
      periodoPrueba,
      clausulas,
      estado
    } = req.body

    const contrato = await prisma.contrato.update({
      where: {
        id: Number(id)
      },

      data: {

        ...(empleadoId !== undefined && {
          empleadoId
        }),

        ...(tipoContrato !== undefined && {
          tipoContrato
        }),

        ...(cargo !== undefined && {
          cargo
        }),

        ...(fechaInicio !== undefined && {
          fechaInicio: new Date(fechaInicio)
        }),

        ...(fechaFin !== undefined && {
          fechaFin: fechaFin
            ? new Date(fechaFin)
            : null
        }),

        ...(salarioContratado !== undefined && {
          salarioContratado
        }),

        ...(jornada !== undefined && {
          jornada
        }),

        ...(horario !== undefined && {
          horario
        }),

        ...(diasLaborales !== undefined && {
          diasLaborales
        }),

        ...(periodoPrueba !== undefined && {
          periodoPrueba
        }),

        ...(clausulas !== undefined && {
          clausulas
        }),

        ...(estado !== undefined && {
          estado
        })
      }
    })

    res.json(contrato)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: error.message
    })
  }
}

  // OBTENER UN CONTRATO POR ID
  const obtenerContratoPorId = async (req, res) => {

    try {

      const { id } = req.params

      const contrato = await prisma.contrato.findUnique({
        where: { id: Number(id) },
        include: {
          empleado: true
        }
      })

      if (!contrato) {
        return res.status(404).json({ error: 'Contrato no encontrado' })
      }

      res.json(contrato)

    } catch (error) {

      console.error(error)

      res.status(500).json({
        error: error.message
      })
    }
  }
  const generarPDFPreview = async (req, res) => {
  try {
    const data = req.body

    const doc = new PDFDocument({ margin: 50, size: 'A4' })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename=preview_contrato.pdf`)

    doc.pipe(res)

    doc.fontSize(16).text('CONTRATO DE TRABAJO (BORRADOR)', {
      align: 'center'
    })

    doc.moveDown()

    doc.fontSize(10).text(JSON.stringify(data, null, 2))

    doc.end()

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}
const PDFDocument = require('pdfkit')
const { generarTextoContrato } = require('../services/contratoPdf.service')

const generarContratoPDF = async (req, res) => {
  try {
    const { id } = req.params

    const contrato = await prisma.contrato.findUnique({
      where: { id: Number(id) },
      include: {
        empleado: {
          include: {
            departamento: true
          }
        }
      }
    })

    if (!contrato) {
      return res.status(404).json({ message: 'Contrato no encontrado' })
    }

    const texto = generarTextoContrato(contrato)

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=contrato_${id}.pdf`
    )

    doc.pipe(res)

    // TÍTULO
    doc.fontSize(16).text('CONTRATO DE TRABAJO', {
      align: 'center'
    })

    doc.moveDown()

    // TEXTO
    doc.fontSize(10).text(texto, {
      align: 'justify',
      lineGap: 4
    })

    doc.end()

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}


  module.exports = {
    obtenerContratos,
    crearContrato,
    actualizarContrato,
    obtenerContratoPorId,
    generarContratoPDF,
    generarPDFPreview
  }