const { Router } = require('express')
const { generarMarcacionesPrueba, obtenerResumenNovedades } = require('../controllers/marcacion.controller.js')

const router = Router()

router.post('/generar', generarMarcacionesPrueba)
router.get('/resumen/:empleadoId/:mes/:anio', obtenerResumenNovedades)

module.exports = router
