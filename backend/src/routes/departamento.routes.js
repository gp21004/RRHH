const express = require('express');
const router = express.Router();
const { crearDepartamento, obtenerDepartamentos } = require('../controllers/departamento.controller.js');

router.post('/', crearDepartamento);
router.get('/', obtenerDepartamentos);

module.exports = router;