const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Ruta donde se guardarán los contratos
const uploadPath = path.join(__dirname, '../../uploads/contratos')

// Si la carpeta no existe, la crea automáticamente
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname)

    const nombreArchivo = `contrato_${req.params.id}_${Date.now()}${extension}`

    cb(null, nombreArchivo)
  }
})

// Solo permitir archivos PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false)
  }
}

// Configuración final
const uploadContrato = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
})

module.exports = uploadContrato