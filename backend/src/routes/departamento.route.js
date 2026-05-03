// archivo: backend/src/routes/departamento.routes.js
const express = require('express');
const router = express.Router();
const { crearDepartamento } = require('../controllers/departamento.controller.js');

// Ruta: POST /api/departamentos
router.post('/', crearDepartamento);

module.exports = router;