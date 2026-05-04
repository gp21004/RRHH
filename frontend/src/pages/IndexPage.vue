<template>
  <q-page padding class="bg-grey-2">
    <h4 class="text-h4 text-primary q-mt-none q-mb-md">Panel de Contratación</h4>

    <div class="row q-col-gutter-md">
      
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">1. Nuevo Departamento</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="guardarDepartamento" class="q-gutter-md">
              <q-input outlined v-model="depto.nombre" label="Nombre del Depto *" lazy-rules
                :rules="[val => val && val.length > 0 || 'El nombre es obligatorio']" />
              
              <q-input outlined v-model="depto.descripcion" label="Descripción" type="textarea" rows="3" />
              
              <q-btn label="Guardar Departamento" type="submit" color="primary" class="full-width" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">2. Registrar Empleado</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="guardarEmpleado" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="empleado.nombres" label="Nombres *" required />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="empleado.apellidos" label="Apellidos *" required />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input outlined v-model="empleado.dui" label="DUI (00000000-0) *" mask="########-#" required />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input outlined v-model="empleado.nit" label="NIT (Opcional)" mask="####-######-###-#" />
                </div>
                <div class="col-12 col-sm-4">
                  <q-input outlined v-model="empleado.nup_afp" label="NUP (AFP)" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input outlined v-model.number="empleado.salarioBase" label="Salario Base ($) *" type="number" step="0.01" required />
                </div>
                <div class="col-12 col-sm-6">
                  <q-select outlined v-model="empleado.departamentoId" :options="opcionesDepartamentos" 
                    option-label="nombre" option-value="id" emit-value map-options
                    label="Seleccionar Departamento *" required />
                </div>
              </div>

              <div class="q-mt-md">
                <q-btn label="Registrar Empleado Salvadoreño" type="submit" color="positive" class="full-width" size="lg" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- ESTADO ---
const depto = ref({ nombre: '', descripcion: '' })
const empleado = ref({ nombres: '', apellidos: '', dui: '', nit: '', nup_afp: '', salarioBase: null, departamentoId: null })
const opcionesDepartamentos = ref([])

// --- FUNCIONES ---

// 1. Cargar departamentos desde el backend
const cargarDepartamentos = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/departamentos')
    if (respuesta.ok) {
      const data = await respuesta.json()
      opcionesDepartamentos.value = data // Llenamos el select con los datos de la DB
    }
  } catch (error) {
    console.error("Error al cargar departamentos:", error)
  }
}

// Llamamos a la carga al iniciar la página
onMounted(() => {
  cargarDepartamentos()
})

// 2. Guardar Departamento
const guardarDepartamento = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/departamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(depto.value)
    })
    
    if (respuesta.ok) {
      $q.notify({ type: 'positive', message: '¡Departamento guardado con éxito!', position: 'top' })
      depto.value = { nombre: '', descripcion: '' } // Limpiar campos
      await cargarDepartamentos() // Recargamos la lista para que aparezca en el select del empleado
    } else {
      const errorData = await respuesta.json()
      $q.notify({ type: 'negative', message: errorData.error || 'Error al guardar' })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error de conexión con el servidor' })
  }
}

// 3. Guardar Empleado
const guardarEmpleado = async () => {
  try {
    // Convertimos el salario a número explícitamente para evitar problemas
    const datosEnvio = { 
      ...empleado.value, 
      salarioBase: parseFloat(empleado.value.salarioBase) 
    }

    const respuesta = await fetch('http://localhost:3000/api/empleados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosEnvio)
    })
    
    const data = await respuesta.json()

    if (respuesta.ok) {
      $q.notify({ type: 'positive', message: '¡Empleado registrado correctamente!', position: 'top' })
      empleado.value = { nombres: '', apellidos: '', dui: '', nit: '', nup_afp: '', salarioBase: null, departamentoId: null }
    } else {
      $q.notify({ type: 'warning', message: data.error || 'Error al guardar el empleado' })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error de conexión' })
  }
}
</script>