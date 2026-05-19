const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// =========================
// CREAR EMPLEADO
// =========================
const crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await prisma.empleado.create({
      data: req.body
    })

    res.json(nuevoEmpleado)
  } catch (error) {
    console.error(error)

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
        departamento: true
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
      salarioBase,
      departamentoId,
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
        dui: dui || null,
        nit: nit || null,
        nup_afp: nup_afp || null,

        salarioBase: Number(salarioBase),

        telefono,
        correo,

        estado: estado,

        departamento: {
          connect: {
            id: Number(departamentoId)
          }
        }
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

    await prisma.empleado.delete({
      where: {
        id: id
      }
    })

    res.json({
      mensaje: 'Empleado eliminado correctamente'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
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