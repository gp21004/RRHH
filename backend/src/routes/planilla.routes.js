// archivo: backend/src/routes/planilla.routes.js
const express = require('express');
const router = express.Router();

// Importamos las dos funciones desde el controlador
const {
    generarPlanillaMensual,
    guardarPlanillaHistorial
} = require('../controllers/planilla.controller.js');

/**
 * RUTA: GET /api/planillas/generar
 * Descripción: Toma a los empleados actuales y calcula sus deducciones de ley 
 * (ISSS, AFP, Renta) para mostrarlos en la tabla del frontend.
 */
router.get('/generar', generarPlanillaMensual);

/**
 * RUTA: POST /api/planillas/guardar
 * Descripción: Recibe la planilla calculada desde el frontend y la guarda 
 * permanentemente en las tablas 'Planilla' y 'DetallePlanilla' de PostgreSQL.
 */
router.post('/guardar', guardarPlanillaHistorial);

module.exports = router;