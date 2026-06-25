const express = require('express')

const router = express.Router()

const {
  obtenerContratos,
  crearContrato,
  actualizarContrato,
  obtenerContratoPorId,
  generarContratoPDFDescarga,
} = require('../controllers/contrato.controller')

router.get('/', obtenerContratos)

router.get('/:id', obtenerContratoPorId)

router.post('/', crearContrato)

router.patch('/:id', actualizarContrato)

router.get('/:id/pdf', generarContratoPDFDescarga)


module.exports = router