// archivo: backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth.middleware');
const {
  login,
  getPerfil,
  updatePerfil,
  changePassword
} = require('../controllers/auth.controller');

// Rutas públicas
router.post('/login', login);

// Rutas protegidas (requieren token)
router.get('/perfil', verificarToken, getPerfil);
router.put('/perfil', verificarToken, updatePerfil);
router.put('/cambiar-password', verificarToken, changePassword);

module.exports = router;
