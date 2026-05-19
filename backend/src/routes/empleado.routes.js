const express = require('express')
const router = express.Router()

const {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
} = require('../controllers/empleado.controller.js')

// Crear
router.post('/', crearEmpleado)

// Obtener todos
router.get('/', obtenerEmpleados)

// Obtener por ID
router.get('/:id', obtenerEmpleadoPorId)

// Actualizar
router.put('/:id', actualizarEmpleado)

// Eliminar
router.delete('/:id', eliminarEmpleado)

module.exports = router