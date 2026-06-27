// archivo: backend/src/controllers/roles.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los roles con sus permisos
const obtenerRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      include: {
        permisos: {
          include: {
            permiso: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const rolesFormateados = roles.map(r => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      isDefault: r.isDefault,
      permisos: r.permisos.map(rp => rp.permisoId) // Array simple de strings (ids de permisos)
    }));

    res.json(rolesFormateados);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener roles' });
  }
};

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const { nombre, descripcion, permisos } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del rol es requerido' });
    }

    const existeRol = await prisma.rol.findUnique({ where: { nombre } });
    if (existeRol) {
      return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
    }

    const nuevoRol = await prisma.rol.create({
      data: {
        nombre,
        descripcion,
        isDefault: false,
        permisos: {
          create: (permisos || []).map(permisoId => ({
            permisoId
          }))
        }
      },
      include: {
        permisos: true
      }
    });

    res.status(201).json({
      id: nuevoRol.id,
      nombre: nuevoRol.nombre,
      descripcion: nuevoRol.descripcion,
      isDefault: nuevoRol.isDefault,
      permisos: nuevoRol.permisos.map(p => p.permisoId)
    });
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear rol' });
  }
};

// Actualizar un rol
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, permisos } = req.body;

    const rolExistente = await prisma.rol.findUnique({ where: { id: Number(id) } });
    if (!rolExistente) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    // Actualizamos el rol (borramos permisos actuales y creamos los nuevos)
    const rolActualizado = await prisma.$transaction(async (tx) => {
      // 1. Borrar permisos actuales
      await tx.rolPermiso.deleteMany({
        where: { rolId: Number(id) }
      });

      // 2. Actualizar datos base del rol y agregar nuevos permisos
      return await tx.rol.update({
        where: { id: Number(id) },
        data: {
          nombre,
          descripcion,
          permisos: {
            create: (permisos || []).map(permisoId => ({
              permisoId
            }))
          }
        },
        include: {
          permisos: true
        }
      });
    });

    res.json({
      id: rolActualizado.id,
      nombre: rolActualizado.nombre,
      descripcion: rolActualizado.descripcion,
      isDefault: rolActualizado.isDefault,
      permisos: rolActualizado.permisos.map(p => p.permisoId)
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar rol' });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await prisma.rol.findUnique({ where: { id: Number(id) } });
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    if (rol.isDefault) {
      return res.status(403).json({ error: 'No se puede eliminar un rol por defecto' });
    }

    // Verificar si hay usuarios usando este rol
    const usuariosConRol = await prisma.usuario.count({ where: { rolId: Number(id) } });
    if (usuariosConRol > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el rol porque hay usuarios asociados a él' });
    }

    await prisma.rol.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar rol' });
  }
};

module.exports = {
  obtenerRoles,
  crearRol,
  actualizarRol,
  eliminarRol
};
