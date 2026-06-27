// archivo: backend/src/routes/roles.routes.js
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

// Todas las rutas de roles requieren estar autenticado y ser Administrador
router.use(verificarToken);
router.use(verificarRol('Administrador'));

router.get('/', rolesController.obtenerRoles);
router.post('/', rolesController.crearRol);
router.put('/:id', rolesController.actualizarRol);
router.delete('/:id', rolesController.eliminarRol);

module.exports = router;
