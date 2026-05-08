<template>
  <q-page padding class="bg-grey-2">
    <q-btn flat icon="arrow_back" label="Volver al Inicio" color="primary" class="q-mb-md" to="/" />
    
    <div class="text-h4 text-primary q-mb-md">Gestión de Contratos</div>

    <!-- Formulario Nuevo Contrato -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Crear Nuevo Contrato</div>
          </q-card-section>
          <q-card-section>
            <div class="q-gutter-md">
              <div class="row q-col-gutter-md">

                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="formulario.empleado" label="Empleado *" />
                </div>

                <div class="col-12 col-sm-6">
                  <q-select outlined v-model="formulario.tipoContrato" :options="tiposContrato" label="Tipo de Contrato *" />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="formulario.fechaInicio" type="date" label="Fecha de Inicio *" />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="formulario.fechaFin" type="date" label="Fecha de Fin" />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input outlined v-model="formulario.salarioContratado" label="Salario Contratado ($) *" type="number" step="0.01" />
                </div>

                <div class="col-12 col-sm-6">
                  <q-select outlined v-model="formulario.estado" :options="estadosContrato" label="Estado *" />
                </div>

                <div class="col-12">
                  <q-input 
                    outlined 
                    v-model="formulario.descripcion" 
                    label="Descripción / Términos del Contrato"
                    type="textarea"
                    rows="4"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12">
                  <q-btn 
                    label="Crear Contrato" 
                    color="primary" 
                    class="full-width" 
                    size="lg" 
                    @click="limpiarFormulario" 
                  />
                </div>
              </div>

            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Listado -->
    <div class="q-mb-md">
      <div class="text-h5 text-primary q-mb-md">Contratos Registrados</div>
      
      <!-- Filtros -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6">
          <q-input outlined v-model="filtroEmpleado" label="Buscar por empleado" dense />
        </div>
        <div class="col-12 col-sm-6">
          <q-select outlined v-model="filtroEstado" :options="estadosContrato" label="Filtrar por estado" clearable dense />
        </div>
      </div>

      <q-table 
        :rows="contratosFiltrados" 
        :columns="columnasContratos" 
        row-key="id" 
        flat 
        bordered
        no-data-label="Aún no hay contratos registrados"
        v-model:pagination="paginacion"
      >

        <!-- Acciones -->
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="text-center">
            <q-btn flat dense round icon="edit" color="primary" size="sm" />
            <q-btn flat dense round icon="delete" color="negative" size="sm" />
          </q-td>
        </template>

        <!-- Estado -->
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge 
              :color="getEstadoColor(props.row.estado)" 
              text-color="white"
              :label="props.row.estado"
            />
          </q-td>
        </template>

        <!-- Salario -->
        <template v-slot:body-cell-salarioContratado="props">
          <q-td :props="props">
            <span class="text-weight-bold">
              ${{ parseFloat(props.row.salarioContratado).toFixed(2) }}
            </span>
          </q-td>
        </template>

      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

// ✅ Fix nombre del componente
defineOptions({
  name: 'GestionContratos'
})

// Estado
const formulario = ref({
  empleado: '',
  tipoContrato: '',
  fechaInicio: '',
  fechaFin: '',
  salarioContratado: '',
  estado: 'Activo',
  descripcion: ''
})

const listaContratos = ref([
  {
    id: 1,
    empleado: 'Juan Pérez García',
    tipoContrato: 'Permanente',
    fechaInicio: '2024-01-15',
    fechaFin: '2026-01-15',
    salarioContratado: 2500,
    estado: 'Activo',
    descripcion: 'Contrato indefinido'
  },
  {
    id: 2,
    empleado: 'María López Martínez',
    tipoContrato: 'Temporal',
    fechaInicio: '2024-06-01',
    fechaFin: '2024-12-31',
    salarioContratado: 1800,
    estado: 'Activo',
    descripcion: 'Contrato por proyecto'
  }
])

const filtroEmpleado = ref('')
const filtroEstado = ref(null)

const tiposContrato = ['Permanente', 'Temporal', 'Por Proyecto', 'Pasantía', 'Consultoría']
const estadosContrato = ['Activo', 'Pausado', 'Finalizado', 'Pendiente']

const paginacion = ref({
  sortBy: 'empleado',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const columnasContratos = [
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left', sortable: true },
  { name: 'tipoContrato', label: 'Tipo', field: 'tipoContrato', align: 'center', sortable: true },
  { name: 'fechaInicio', label: 'Fecha Inicio', field: 'fechaInicio', align: 'center', sortable: true },
  { name: 'fechaFin', label: 'Fecha Fin', field: 'fechaFin', align: 'center' },
  { name: 'salarioContratado', label: 'Salario', field: 'salarioContratado', align: 'right', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

// Métodos
const limpiarFormulario = () => {
  formulario.value = {
    empleado: '',
    tipoContrato: '',
    fechaInicio: '',
    fechaFin: '',
    salarioContratado: '',
    estado: 'Activo',
    descripcion: ''
  }
}

const getEstadoColor = (estado) => {
  const colores = {
    Activo: 'positive',
    Pausado: 'warning',
    Finalizado: 'negative',
    Pendiente: 'info'
  }
  return colores[estado] || 'grey'
}

// Computed
const contratosFiltrados = computed(() => {
  return listaContratos.value.filter(contrato => {
    const coincideEmpleado =
      !filtroEmpleado.value ||
      contrato.empleado.toLowerCase().includes(filtroEmpleado.value.toLowerCase())

    const coincideEstado =
      !filtroEstado.value ||
      contrato.estado === filtroEstado.value

    return coincideEmpleado && coincideEstado
  })
})
</script>

<style scoped>
.bg-grey-2 {
  background-color: #f5f5f5;
}
</style>