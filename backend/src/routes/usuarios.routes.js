// archivo: backend/src/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

// Todas las rutas de usuarios requieren estar autenticado
router.use(verificarToken);

// Solo el rol de Administrador puede gestionar usuarios
router.use(verificarRol('Administrador'));

router.get('/', usuariosController.obtenerUsuarios);
router.post('/', usuariosController.crearUsuario);
router.put('/:id', usuariosController.actualizarUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;
