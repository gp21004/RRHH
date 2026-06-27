// archivo: backend/src/controllers/usuarios.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    const usuariosFormateados = usuarios.map(u => ({
      id: u.id,
      nombreCompleto: u.nombreCompleto,
      correo: u.correo,
      username: u.username,
      activo: u.activo,
      rolId: u.rolId,
      rol: u.rol ? u.rol.nombre : 'Sin Rol'
    }));

    res.json(usuariosFormateados);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombreCompleto, username, correo, password, rol: rolId } = req.body;

    if (!nombreCompleto || !username || !correo || !password || !rolId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el correo o username ya existe
    const existeUsuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo },
          { username }
        ]
      }
    });

    if (existeUsuario) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese correo electrónico o nombre de usuario' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        username,
        correo,
        nombreCompleto,
        password: passwordHash,
        rolId: Number(rolId),
        activo: true
      },
      include: {
        rol: true
      }
    });

    res.status(201).json({
      id: nuevoUsuario.id,
      nombreCompleto: nuevoUsuario.nombreCompleto,
      correo: nuevoUsuario.correo,
      rolId: nuevoUsuario.rolId,
      rol: nuevoUsuario.rol ? nuevoUsuario.rol.nombre : 'Sin Rol'
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear usuario' });
  }
};

// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, username, correo, password, rol: rolId } = req.body;

    // Verificar existencia del usuario
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const dataToUpdate = {
      nombreCompleto,
      correo,
      username,
      rolId: Number(rolId)
    };

    // Actualizar password solo si se proporciona uno nuevo
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      include: {
        rol: true
      }
    });

    res.json({
      id: usuarioActualizado.id,
      nombreCompleto: usuarioActualizado.nombreCompleto,
      correo: usuarioActualizado.correo,
      rolId: usuarioActualizado.rolId,
      rol: usuarioActualizado.rol ? usuarioActualizado.rol.nombre : 'Sin Rol'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar usuario' });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Proteger al administrador principal (id = 1)
    if (Number(id) === 1) {
      return res.status(403).json({ error: 'No se puede eliminar el usuario administrador principal' });
    }

    await prisma.usuario.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor al eliminar usuario' });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
