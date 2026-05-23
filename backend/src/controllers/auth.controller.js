// archivo: backend/src/controllers/auth.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { username }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ error: 'Usuario desactivado. Contacte al administrador.' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT (expira en 8 horas)
    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        nombreCompleto: usuario.nombreCompleto,
        rol: usuario.rol
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Responder sin la contraseña
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// =========================
// OBTENER PERFIL
// =========================
const getPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// =========================
// ACTUALIZAR PERFIL
// =========================
const updatePerfil = async (req, res) => {
  try {
    const { nombreCompleto, correo } = req.body;

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: {
        nombreCompleto,
        correo
      }
    });

    const { password: _, ...usuarioSinPassword } = usuarioActualizado;
    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// =========================
// CAMBIAR CONTRASEÑA
// =========================
const changePassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }

    if (passwordNuevo.length < 6) {
      return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    // Obtener usuario actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id }
    });

    // Verificar contraseña actual
    const passwordValido = await bcrypt.compare(passwordActual, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordNuevo, salt);

    await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { password: passwordHash }
    });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

module.exports = {
  login,
  getPerfil,
  updatePerfil,
  changePassword
};
