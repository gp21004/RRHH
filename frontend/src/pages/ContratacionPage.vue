<template>
  <q-page padding class="bg-grey-2">
    <q-btn flat icon="arrow_back" label="Volver al Inicio" color="primary" class="q-mb-md" to="/" />
    
    <div class="text-h4 text-primary q-mb-md">Contratación y Personal</div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="bg-secondary text-white"><div class="text-h6">Nuevo Departamento</div></q-card-section>
          <q-card-section>
            <q-form @submit.prevent="guardarDepartamento" class="q-gutter-md">
              <q-input outlined v-model="depto.nombre" label="Nombre del Depto *" required />
              <q-input outlined v-model="depto.descripcion" label="Descripción" type="textarea" rows="2" />
              <q-btn label="Guardar" type="submit" color="primary" class="full-width" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="bg-primary text-white"><div class="text-h6">Registrar Empleado</div></q-card-section>
          <q-card-section>
            <q-form @submit.prevent="guardarEmpleado" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6"><q-input outlined v-model="empleado.nombres" label="Nombres *" required /></div>
                <div class="col-12 col-sm-6"><q-input outlined v-model="empleado.apellidos" label="Apellidos *" required /></div>
                <div class="col-12 col-sm-4"><q-input outlined v-model="empleado.dui" label="DUI *" mask="########-#" required /></div>
                <div class="col-12 col-sm-4"><q-input outlined v-model="empleado.nit" label="NIT" mask="####-######-###-#" /></div>
                <div class="col-12 col-sm-4"><q-input outlined v-model="empleado.nup_afp" label="NUP (AFP)" /></div>
                <div class="col-12 col-sm-6"><q-input outlined v-model.number="empleado.salarioBase" label="Salario Base ($) *" type="number" step="0.01" required /></div>
                <div class="col-12 col-sm-6">
                  <q-select outlined v-model="empleado.departamentoId" :options="opcionesDepartamentos" option-label="nombre" option-value="id" emit-value map-options label="Departamento *" required />
                </div>
              </div>
              <q-btn label="Registrar Empleado" type="submit" color="positive" class="full-width q-mt-md" size="lg" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="text-h5 text-primary q-mb-md">Listado de Empleados</div>
    <q-table :rows="listaEmpleados" :columns="columnasEmpleados" row-key="id" flat bordered no-data-label="Aún no hay empleados registrados" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const depto = ref({ nombre: '', descripcion: '' })
const empleado = ref({ nombres: '', apellidos: '', dui: '', nit: '', nup_afp: '', salarioBase: null, departamentoId: null })
const opcionesDepartamentos = ref([])
const listaEmpleados = ref([])

const columnasEmpleados = [
  { name: 'nombres', label: 'Nombres', field: 'nombres', align: 'left', sortable: true },
  { name: 'apellidos', label: 'Apellidos', field: 'apellidos', align: 'left', sortable: true },
  { name: 'dui', label: 'DUI', field: 'dui', align: 'center' },
  { name: 'departamento', label: 'Departamento', field: row => row.departamento ? row.departamento.nombre : 'Sin Depto', align: 'center' },
  { name: 'salarioBase', label: 'Salario Base', field: 'salarioBase', align: 'right', format: val => `$${parseFloat(val).toFixed(2)}`, sortable: true }
]

const cargarDepartamentos = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/departamentos')
    if (res.ok) opcionesDepartamentos.value = await res.json()
  } catch (error) { console.error(error) }
}

const cargarEmpleados = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/empleados')
    if (res.ok) listaEmpleados.value = await res.json()
  } catch (error) { console.error(error) }
}

onMounted(() => {
  cargarDepartamentos()
  cargarEmpleados()
})

const guardarDepartamento = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/departamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(depto.value)
    })
    if (res.ok) {
      $q.notify({ type: 'positive', message: '¡Departamento guardado!', position: 'top' })
      depto.value = { nombre: '', descripcion: '' }
      await cargarDepartamentos()
    }
  } catch (error) { console.error(error) }
}

const guardarEmpleado = async () => {
  try {
    const datosEnvio = { ...empleado.value, salarioBase: parseFloat(empleado.value.salarioBase) }
    const res = await fetch('http://localhost:3000/api/empleados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosEnvio)
    })
    const data = await res.json()
    if (res.ok) {
      $q.notify({ type: 'positive', message: '¡Empleado registrado!', position: 'top' })
      empleado.value = { nombres: '', apellidos: '', dui: '', nit: '', nup_afp: '', salarioBase: null, departamentoId: null }
      await cargarEmpleados()
    } else {
      $q.notify({ type: 'warning', message: data.error })
    }
  } catch (error) { console.error(error) }
}
</script>