const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const subirContratoFirmado = async (req, res) => {
  try {
    const contratoId = Number(req.params.id)
    const file = req.file

    console.log("🔵 contratoId recibido:", contratoId)
    console.log("🔵 file:", file?.filename)

    if (!file) {
      return res.status(400).json({ message: "No file" })
    }

    // 1. Guardar documento
    const documento = await prisma.contratoDocumento.create({
      data: {
        contratoId,
        nombreArchivo: file.filename,
        nombreOriginal: file.originalname,
        rutaArchivo: file.path,
        tipoMime: file.mimetype,
        tamano: file.size,
        tipo: "CONTRATO_FIRMADO"
      }
    })

    console.log("🟢 Documento guardado OK")

    // 🔥 VALIDACIÓN CRÍTICA
    const contratoAntes = await prisma.contrato.findUnique({
      where: { id: contratoId }
    })

    console.log("🟡 Estado ANTES:", contratoAntes.estado)

    // 2. UPDATE FORZADO
    const contratoActualizado = await prisma.contrato.update({
      where: { id: contratoId },
      data: {
        estado: "Activo"
      }
    })

    console.log("🟢 Estado DESPUÉS:", contratoActualizado.estado)

    return res.json({
      message: "OK",
      documento,
      contrato: contratoActualizado
    })

  } catch (error) {
    console.error("❌ ERROR FULL:", error)
    return res.status(500).json({
      message: "Error",
      error: error.message
    })
  }
}

module.exports = {
  subirContratoFirmado
}