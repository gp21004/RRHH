const express = require('express')
const router = express.Router()

const { subirContratoFirmado } = require('../controllers/contratoDocumento.controller')
const uploadContrato = require('../middleware/uploadContrato')

// Subir documento firmado de contrato
router.post(
  '/contratos/:id/documento',
  uploadContrato.single('archivo'),
  subirContratoFirmado
)

module.exports = router