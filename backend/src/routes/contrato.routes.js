const express = require('express')

const router = express.Router()

const {
  obtenerContratos,
  crearContrato,
  actualizarContrato,
  obtenerContratoPorId
} = require('../controllers/contrato.controller')

router.get('/', obtenerContratos)

router.get('/:id', obtenerContratoPorId)

router.post('/', crearContrato)

router.patch('/:id', actualizarContrato)


module.exports = router