const express = require('express')

const router = express.Router()

const {
  obtenerContratos,
  crearContrato
} = require('../controllers/contrato.controller')

router.get('/', obtenerContratos)

router.post('/', crearContrato)

module.exports = router