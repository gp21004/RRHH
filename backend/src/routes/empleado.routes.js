// archivo: backend/src/routes/empleado.routes.js
const express = require('express');
const router = express.Router();
const { crearEmpleado, obtenerEmpleados } = require('../controllers/empleado.controller.js');

// Rutas: /api/empleados
router.post('/', crearEmpleado);
router.get('/', obtenerEmpleados);

module.exports = router;