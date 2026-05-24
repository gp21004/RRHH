<template>
  <q-page padding class="page-bg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <q-btn flat icon="arrow_back" label="Volver al inicio" color="primary" class="text-weight-bold" to="/" />
      </div>
    </div>

    <!-- Título y Descripción -->
    <div class="q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-ma-none q-mb-xs">Gestión de Contratos</h1>
      <p class="text-subtitle2 text-grey-7 q-ma-none">Administra los contratos laborales y documentos legales de los empleados.</p>
    </div>

    <!-- Estadísticas Cards - Grid compacto -->
    <div class="stats-grid q-mb-lg">
      <!-- Contratos Activos -->
      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon positive">
              <q-icon name="description" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ contratosActivos }}</div>
              <div class="stat-label">Contratos Activos</div>
              <div class="stat-percentage">{{ porcentajeActivos }}%</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Pendientes de Firma -->
      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon warning">
              <q-icon name="schedule" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ pendientesFirma }}</div>
              <div class="stat-label">Pendientes de Firma</div>
              <div class="stat-percentage">{{ porcentajePendiente }}%</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Finalizados -->
      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon info">
              <q-icon name="check_circle" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ finalizados }}</div>
              <div class="stat-label">Finalizados</div>
              <div class="stat-percentage">Este año</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Por Vencer -->
      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon negative">
              <q-icon name="event_note" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ porVencer }}</div>
              <div class="stat-label">Por Vencer (30d)</div>
              <div class="stat-percentage">Requieren atención</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Nuevo Contrato Form -->
    <div class="q-mb-lg">
      <h2 class="text-h6 text-weight-bold q-ma-none q-mb-md">Nuevo Contrato</h2>
      
      <q-card class="form-card">
        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="guardarContrato" class="form-content">
            <!-- Sección 1: Datos del Empleado -->
            <div>
              <div class="section-header q-mb-md">
                <q-icon name="person" color="primary" size="24px" />
                <span class="q-ml-md text-subtitle2 text-weight-bold">1. Datos del Empleado</span>
              </div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select 
                    outlined 
                    dense 
                    v-model="empleadoSeleccionado" 
                    :options="listaEmpleados" 
                    option-label="nombres"
                    @update:model-value="cargarDatosEmpleado"
                    label="Seleccionar Empleado *" 
                    required 
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model="formulario.departamento" label="Departamento" readonly />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model="formulario.dui" label="DUI" readonly />
                </div>
              </div>
            </div>

            <!-- Separador -->
            <q-separator />

            <!-- Sección 2: Condiciones del Contrato -->
            <div>
              <div class="section-header q-mb-md">
                <q-icon name="contract" color="primary" size="24px" />
                <span class="q-ml-md text-subtitle2 text-weight-bold">2. Condiciones del Contrato</span>
              </div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select outlined dense v-model="formulario.tipoContrato" :options="tiposContrato" label="Tipo de Contrato *" required />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model="formulario.cargo" label="Cargo / Puesto *" required />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model="formulario.fechaInicio" type="date" label="Fecha de Inicio *" required />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model="formulario.fechaFin" type="date" label="Fecha de Fin" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input outlined dense v-model.number="formulario.salarioContratado" type="number" label="Salario Mensual ($) *" step="0.01" required />
                </div>
                <div class="col-12 col-md-6">
                  <q-input 
                    outlined 
                    dense 
                    v-model="formulario.jornada" 
                    label="Horas Semanales (Calculadas)" 
                    readonly
                    hint="Se calcula automáticamente según horario y días"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input 
                    outlined 
                    dense 
                    v-model="formulario.horaInicio" 
                    type="time" 
                    label="Hora Inicio *" 
                    required
                    @update:model-value="calcularHorasSemanales"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input 
                    outlined 
                    dense 
                    v-model="formulario.horaFin" 
                    type="time" 
                    label="Hora Fin *" 
                    required
                    @update:model-value="calcularHorasSemanales"
                  />
                </div>
                <div class="col-12">
                  <div class="text-subtitle2 text-weight-bold q-mb-sm">Días Laborales *</div>
                  <div class="row q-col-gutter-md">
                    <div class="col-auto" v-for="dia in diasSemana" :key="dia">
                      <q-checkbox 
                        :label="dia" 
                        :model-value="formulario.diasLaborales.includes(dia)"
                        @update:model-value="toggleDia(dia)"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <q-select outlined dense v-model="formulario.periodoPrueba" :options="periodosPrueba" label="Período de Prueba" />
                </div>
              </div>
            </div>

            <!-- Separador -->
            <q-separator />

            <!-- Sección 3: Cláusulas Adicionales -->
            <div>
              <div class="section-header q-mb-md">
                <q-icon name="note" color="primary" size="24px" />
                <span class="q-ml-md text-subtitle2 text-weight-bold">3. Cláusulas Adicionales (Opcional)</span>
              </div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input 
                    outlined 
                    dense
                    v-model="formulario.clausulas" 
                    label="Términos y condiciones adicionales"
                    type="textarea"
                    rows="3"
                    placeholder="Ingresa cláusulas adicionales o comentarios especiales del contrato..."
                  />
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="buttons-section">
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-btn label="Limpiar" color="grey-7" flat @click="limpiarFormulario" />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn label="Subir Formulario" color="positive" flat />
                </div>
                <div class="col-auto">
                  <q-btn label="Generar PDF" color="info" />
                </div>
                <div class="col-auto">
                  <q-btn label="Guardar Contrato" type="submit" color="primary" />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <!-- Contratos Registrados -->
    <div class="q-mb-md">
      <h2 class="text-h6 text-weight-bold q-ma-none q-mb-md">Contratos Registrados</h2>
    </div>

    <!-- Filtros -->
    <q-card class="filtros-card q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6">
            <q-input 
              outlined 
              dense
              v-model="filtroEmpleado" 
              label="Buscar por empleado..." 
              prefix-icon="search"
              clearable
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-select 
              outlined 
              dense
              v-model="filtroEstado" 
              :options="estadosContrato" 
              label="Filtrar por estado"
              clearable
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Contratos -->
    <q-card class="table-card">
      <q-table 
        :rows="contratosFiltrados" 
        :columns="columnasContratos" 
        row-key="id" 
        flat 
        bordered
        no-data-label="No se encontraron contratos"
        class="contratos-table"
      >
        <!-- Columna Empleado con Avatar -->
        <template #body-cell-empleado="props">
          <q-td :props="props" class="empleado-cell">
            <div class="flex items-center" style="gap: 12px;">
              <q-avatar 
                :label="getInitials(props.row.empleado)" 
                :style="{ backgroundColor: getAvatarColor(props.row.id) }"
                text-color="white"
                size="md"
              />
              <div style="flex: 1;">
                <div class="text-weight-bold" style="color: #e5e7eb;">{{ props.row.empleado }}</div>
                <div class="text-caption" style="color: #9ca3af;">{{ props.row.tipoContrato }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Columna Estado -->
        <template #body-cell-estado="props">
          <q-td :props="props">
            <q-badge 
              :color="getEstadoColor(props.row.estado)" 
              text-color="white"
              :label="props.row.estado"
            />
          </q-td>
        </template>

        <!-- Columna Salario -->
        <template #body-cell-salarioContratado="props">
          <q-td :props="props">
            <span style="color: #e5e7eb; font-weight: bold;">${{ parseFloat(props.row.salarioContratado).toFixed(2) }}</span>
          </q-td>
        </template>

        <!-- Columna Acciones -->
        <template #body-cell-acciones="props">
          <q-td :props="props" class="acciones-cell">
            <div class="flex items-center justify-center" style="gap: 4px;">
              <q-btn flat dense round icon="visibility" size="sm" color="primary" />
              <q-btn flat dense round icon="edit" size="sm" color="warning" />
              <q-btn flat dense round icon="delete" size="sm" color="negative" />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup name="ContratosPage">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
// Estado del formulario
const formulario = ref({
  empleado: '',
  departamento: '',
  cargo: '',
  dui: '',
  tipoContrato: '',
  fechaInicio: '',
  fechaFin: '',
  salarioContratado: '',
  jornada: '',
  horaInicio: '',
  horaFin: '',
  diasLaborales: [],
  periodoPrueba: '',
  clausulas: ''
})

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const periodosPrueba = ['15 días', '30 días', '60 días', '90 días', 'Sin período de prueba']

const listaEmpleados = ref([])
const empleadoSeleccionado = ref(null)

const listaContratos = ref([])
const filtroEmpleado = ref('')
const filtroEstado = ref(null)

const tiposContrato = ['Por tiempo indefinido', 'Contrato Temporal', 'Por Proyecto', 'Pasantía', 'Consultoría']
const estadosContrato = ['Activo', 'Pendiente', 'Finalizado', 'Pausado']

const columnasContratos = [
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left', sortable: true },
  { name: 'tipoContrato', label: 'Tipo de Contrato', field: 'tipoContrato', align: 'center', sortable: true },
  { name: 'fechaInicio', label: 'Fecha Inicio', field: 'fechaInicio', align: 'center', sortable: true },
  { name: 'fechaFin', label: 'Fecha Fin', field: 'fechaFin', align: 'center' },
  { name: 'salarioContratado', label: 'Salario', field: 'salarioContratado', align: 'right', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'firma', label: 'Firma', field: 'firma', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

// Funciones Helper
const getInitials = (nombre) => {
  return nombre
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const getAvatarColor = (id) => {
  const colors = ['#2563eb', '#16a34a', '#dc2626', '#ea580c', '#9333ea', '#0891b2']
  return colors[id % colors.length]
}

const getEstadoColor = (estado) => {
  const colores = {
    'Activo': 'positive',
    'Pendiente': 'warning',
    'Finalizado': 'negative',
    'Pausado': 'info'
  }
  return colores[estado] || 'grey'
}

// Métodos
const cargarEmpleados = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/empleados')
    listaEmpleados.value = await res.json()
  } catch (error) {
    console.error('Error al cargar empleados:', error)
  }
}
const cargarContratos = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/contratos')

    const data = await res.json()

    // Validar si viene array
    listaContratos.value = Array.isArray(data) ? data : []

  } catch (error) {
    console.error('Error al cargar contratos:', error)
    listaContratos.value = []
  }
}
const cargarDatosEmpleado = () => {
  if (empleadoSeleccionado.value) {
    const empleado = empleadoSeleccionado.value
    formulario.value.empleado = `${empleado.nombres} ${empleado.apellidos}`
    formulario.value.departamento = empleado.departamento?.nombre || ''
    formulario.value.dui = empleado.dui || ''
  }
}

const calcularHorasSemanales = () => {
  const inicio = formulario.value.horaInicio
  const fin = formulario.value.horaFin

  if (!inicio || !fin || formulario.value.diasLaborales.length === 0) {
    formulario.value.jornada = ''
    return
  }

  const [horaInicio, minInicio] = inicio.split(':').map(Number)
  const [horaFin, minFin] = fin.split(':').map(Number)

  const minutosInicio = horaInicio * 60 + minInicio
  const minutosFin = horaFin * 60 + minFin

  let horasPorDia = (minutosFin - minutosInicio) / 60

  if (horasPorDia < 0) {
    horasPorDia += 24
  }

  const horasSemanales = horasPorDia * formulario.value.diasLaborales.length

  formulario.value.jornada = `${horasSemanales.toFixed(2)} horas`
}

const toggleDia = (dia) => {
  const index = formulario.value.diasLaborales.indexOf(dia)
  if (index > -1) {
    formulario.value.diasLaborales.splice(index, 1)
  } else {
    formulario.value.diasLaborales.push(dia)
  }
  calcularHorasSemanales()
}

const limpiarFormulario = () => {
  formulario.value = {
    empleado: '',
    departamento: '',
    cargo: '',
    dui: '',
    tipoContrato: '',
    fechaInicio: '',
    fechaFin: '',
    salarioContratado: '',
    jornada: '',
    horaInicio: '',
    horaFin: '',
    diasLaborales: [],
    periodoPrueba: '',
    clausulas: ''
  }
  empleadoSeleccionado.value = null
}

const guardarContrato = async () => {
  try {
    if (!empleadoSeleccionado.value) {
      $q.notify({
        type: 'negative',
        message: 'Por favor selecciona un empleado',
        position: 'top',
        timeout: 3000
      })
      return
    }

    if (formulario.value.diasLaborales.length === 0) {
      $q.notify({
        type: 'negative',
        message: 'Por favor selecciona al menos un día laboral',
        position: 'top',
        timeout: 3000
      })
      return
    }

    const horario = `${formulario.value.horaInicio} - ${formulario.value.horaFin}`

    const body = {
      empleadoId: empleadoSeleccionado.value.id,
      tipoContrato: formulario.value.tipoContrato,
      cargo: formulario.value.cargo,
      fechaInicio: formulario.value.fechaInicio,
      fechaFin: formulario.value.fechaFin || null,
      salarioContratado: parseFloat(formulario.value.salarioContratado),
      jornada: formulario.value.jornada,
      horario: horario,
      diasLaborales: formulario.value.diasLaborales.join(', '),
      periodoPrueba: formulario.value.periodoPrueba,
      clausulas: formulario.value.clausulas
    }

    const res = await fetch('http://localhost:3000/api/contratos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (res.ok) {
      $q.notify({
        type: 'positive',
        message: `Contrato creado exitosamente para ${empleadoSeleccionado.value.nombres}`,
        position: 'top',
        timeout: 3000
      })
      await cargarContratos()
      limpiarFormulario()
    } else {
      $q.notify({
        type: 'negative',
        message: data.message || 'Error al crear el contrato',
        position: 'top',
        timeout: 3000
      })
    }

  } catch (error) {
    console.error('Error al guardar contrato:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al crear el contrato. Intenta de nuevo.',
      position: 'top',
      timeout: 3000
    })
  }
}

onMounted(() => {
  cargarEmpleados()
  cargarContratos()
})
// Estadísticas Computed
const contratosActivos = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Activo').length
})

const pendientesFirma = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Pendiente').length
})

const finalizados = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Finalizado').length
})

const porVencer = computed(() => {
  return 2 // Placeholder - en producción se calcularía basado en fechas
})

const totalContratos = computed(() => listaContratos.value.length)

const porcentajeActivos = computed(() => {
  return totalContratos.value > 0 ? Math.round((contratosActivos.value / totalContratos.value) * 100) : 0
})

const porcentajePendiente = computed(() => {
  return totalContratos.value > 0 ? Math.round((pendientesFirma.value / totalContratos.value) * 100) : 0
})

// Computed - Filtrados
const contratosFiltrados = computed(() => {
  return listaContratos.value.filter(contrato => {
    const coincideEmpleado = !filtroEmpleado.value || 
      contrato.empleado.toLowerCase().includes(filtroEmpleado.value.toLowerCase())
    
    const coincideEstado = !filtroEstado.value || contrato.estado === filtroEstado.value

    return coincideEmpleado && coincideEstado
  })
})
</script>

<style scoped>
.page-bg {
  background-color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background-color: #2a2e3e;
  border: 1px solid #34394a;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: #2563eb;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.stat-icon.positive {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.info {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon.negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-content-inline {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
}

.stat-number-small {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  font-size: 12px;
  color: #e5e7eb;
  font-weight: 500;
}

.stat-percentage {
  font-size: 11px;
  color: #9ca3af;
}

.buttons-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #34394a;
}

.form-card {
  background-color: #2a2e3e;
  border: 1px solid #34394a;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #34394a;
}

.filtros-card {
  background-color: #2a2e3e;
  border: 1px solid #34394a;
  border-radius: 12px;
}

.table-card {
  background-color: #2a2e3e;
  border: 1px solid #34394a;
  border-radius: 12px;
  overflow: hidden;
}

.contratos-table :deep(.q-table__card) {
  box-shadow: none;
  background-color: #2a2e3e;
}

.contratos-table :deep(thead) {
  background-color: #3f4a5e;
}

.contratos-table :deep(th) {
  background-color: #3f4a5e;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid #34394a;
  padding: 16px 12px;
}

.contratos-table :deep(td) {
  padding: 16px 12px;
  border-bottom: 1px solid #34394a;
  color: #e5e7eb;
  background-color: #2a2e3e;
}

.contratos-table :deep(tbody tr) {
  background-color: #2a2e3e;
}

.contratos-table :deep(tbody tr:hover) {
  background-color: #34394a !important;
}

.contratos-table :deep(tbody tr:hover td) {
  color: #f3f4f6 !important;
  background-color: #34394a !important;
}

.empleado-cell {
  background-color: #2a2e3e;
}

.acciones-cell {
  background-color: #2a2e3e;
}

:deep(.q-field__control) {
  color: #e5e7eb;
}

:deep(.q-field__label) {
  color: #9ca3af;
}

:deep(.q-input__control, .q-select__control) {
  color: #e5e7eb;
}

:deep(.q-item__label) {
  color: #e5e7eb;
}

.text-grey-7 {
  color: #9ca3af !important;
}

.q-mb-lg {
  margin-bottom: 32px;
}

.q-col-gutter-lg {
  gap: 32px !important;
}
</style>
