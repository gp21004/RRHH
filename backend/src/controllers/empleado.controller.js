const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// =========================
// CREAR EMPLEADO
// =========================
const crearEmpleado = async (req, res) => {
  try {

    const {
      nombres,
      apellidos,
      dui,
      nit,
      nup_afp,
      fechaNacimiento,
      fechaIngreso,
      departamentoId,
      telefono,
      correo,
      estado
    } = req.body

    const nuevoEmpleado = await prisma.empleado.create({
      data: {
        nombres,
        apellidos,

        dui,
        nit: nit || null,
        nup_afp: nup_afp || null,

        fechaNacimiento: fechaNacimiento
          ? new Date(fechaNacimiento + 'T00:00:00')
          : null,

        fechaIngreso: fechaIngreso
          ? new Date(fechaIngreso + 'T00:00:00')
          : undefined,

        telefono: telefono || null,
        correo: correo || null,

        estado: estado === false ? false : true,

        departamento: {
          connect: {
            id: Number(departamentoId)
          }
        }
      }
    })

    res.json(nuevoEmpleado)

  } catch (error) {
    console.error(error)

    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'DUI, NIT o NUP ya existe'
      })
    }

    res.status(500).json({
      error: 'Error al crear empleado'
    })
  }
}

// =========================
// OBTENER TODOS
// =========================
const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        departamento: true,
        contratos: {
          where: { estado: 'Activo' }
        }
      }
    })

    res.json(empleados)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Error al obtener empleados'
    })
  }
}

// =========================
// OBTENER POR ID
// =========================
const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const id = Number(req.params.id)

    const empleado = await prisma.empleado.findUnique({
      where: {
        id: id
      },
      include: {
        departamento: true
      }
    })

    if (!empleado) {
      return res.status(404).json({
        error: 'Empleado no encontrado'
      })
    }

    res.json(empleado)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Error al obtener empleado'
    })
  }
}

// =========================
// ACTUALIZAR EMPLEADO
// =========================
const actualizarEmpleado = async (req, res) => {
  try {

    const id = Number(req.params.id)

    const {
      nombres,
      apellidos,
      dui,
      nit,
      nup_afp,
      departamentoId,
      fechaNacimiento,
      fechaIngreso,
      telefono,
      correo,
      estado
    } = req.body

const empleadoActualizado = await prisma.empleado.update({
  where: {
    id
  },

  data: {
    nombres,
    apellidos,

    dui,
    nit: nit || null,
    nup_afp: nup_afp || null,

    fechaNacimiento: fechaNacimiento
      ? new Date(fechaNacimiento + 'T00:00:00')
      : null,

    ...(fechaIngreso !== undefined && {
      fechaIngreso: new Date(fechaIngreso + 'T00:00:00')
    }),

    telefono: telefono || null,
    correo: correo || null,

    estado: estado === false ? false : true,

    departamento: departamentoId
      ? {
          connect: {
            id: Number(departamentoId)
          }
        }
      : undefined
  }
})

    res.json(empleadoActualizado)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Error actualizando empleado'
    })
  }
}
// =========================
// ELIMINAR EMPLEADO
// =========================
const eliminarEmpleado = async (req, res) => {
  try {
    const id = Number(req.params.id)

    // 1. Buscar contratos activos del empleado
    const contratoActivo = await prisma.contrato.findFirst({
      where: {
        empleadoId: id,
        estado: 'Activo' // importante según tu schema
      }
    })

    // 2. Bloquear eliminación si tiene contrato activo
    if (contratoActivo) {
      return res.status(400).json({
        error: 'No se puede eliminar el empleado porque tiene un contrato activo'
      })
    }

    // 3. (Opcional pero recomendado) verificar si existen contratos históricos
    const contratos = await prisma.contrato.findMany({
      where: { empleadoId: id }
    })

    if (contratos.length > 0) {
      return res.status(400).json({
        error: 'No se puede eliminar el empleado porque tiene historial de contratos'
      })
    }

    // 4. Eliminar empleado (YA SEGURO)
    await prisma.empleado.delete({
      where: { id }
    })

    return res.json({
      mensaje: 'Empleado eliminado correctamente'
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: 'Error al eliminar empleado'
    })
  }
}

module.exports = {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
}