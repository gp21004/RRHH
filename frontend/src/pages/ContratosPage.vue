<template>
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando contratos...
      </div>
    </div>
  </div>

  <q-page padding v-else>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <q-btn flat icon="arrow_back" label="Volver al inicio" color="primary" class="text-weight-bold" to="/" />
      </div>
    </div>

    <div class="q-mb-lg">
      <h1 class="text-h4 text-weight-bold q-ma-none q-mb-xs">Gestión de Contratos</h1>
      <p class="text-subtitle2 text-grey-7 q-ma-none">Administra los contratos laborales y documentos legales de los empleados.</p>
    </div>

    <div class="stats-grid q-mb-lg">
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

    <div class="q-mb-lg">
      <div class="row items-center justify-between q-mb-md">
        <div>
          <h2 class="text-h6 text-weight-bold q-ma-none q-mb-xs">
            {{ editando ? 'Editar Contrato' : 'Nuevo Contrato' }}
          </h2>
          <div class="text-subtitle2 text-grey-7 q-ma-none">
            {{ editando ? 'Actualiza la información del contrato' : 'Crea un nuevo contrato laboral' }}
          </div>
        </div>
      </div>
      
      <q-card class="form-card">
        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="editando ? actualizarContrato() : guardarContrato()" class="form-content">
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
                    :options="empleadosDisponibles" 
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

            <q-separator />

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
                  <q-input outlined dense v-model="formulario.fechaInicio" type="date" label="Fecha de Inicio *" max="9999-12-31" required />
                </div>
                <div class="col-12 col-md-6">
                  <q-input 
                    outlined 
                    dense 
                    v-model="formulario.fechaFin" 
                    type="date" 
                    label="Fecha de Fin"
                    max="9999-12-31"
                    :disable="formulario.tipoContrato === 'Por tiempo indefinido'"
                    hint="No aplica para contratos indefinidos"
                  />
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

            <q-separator />

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

            <div class="buttons-section">
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-btn label="Limpiar" color="grey-7" flat @click="limpiarFormulario" />
                </div>
                <div 
                  class="col-auto"
                  v-if="editando"
                >
                  <q-btn
                    label="Cancelar"
                    color="negative"
                    flat
                    @click="cancelarEdicion"
                  />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn 
                    :label="editando ? 'Actualizar Contrato' : 'Guardar Contrato'" 
                    type="submit" 
                    color="primary" 
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mb-md">
      <h2 class="text-h6 text-weight-bold q-ma-none q-mb-md">Contratos Registrados</h2>
    </div>

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
          <div class="col-12 col-sm-6">
            <q-checkbox 
              v-model="filtroVencer"
              label="Mostrar solo contratos por vencer (30 días)"
              color="warning"
              left-label
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

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
        <template #body-cell-empleado="props">
          <q-td :props="props" class="empleado-cell">
            <div class="flex items-center" style="gap: 12px;">
              <q-avatar 
                size="md"
                text-color="white"
                :style="{ backgroundColor: getAvatarColor(props.row.empleado) }"
                class="text-weight-bold"
              >
                {{ getInitials(props.row.empleado) }}
              </q-avatar>
              <div style="flex: 1;">
                <div class="text-weight-bold" style="color: #e5e7eb;">{{ props.row.empleado }}</div>
                <div class="text-caption" style="color: #9ca3af;">{{ props.row.tipoContrato }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-estado="props">
          <q-td :props="props">
            <q-badge 
              :color="getEstadoColor(props.row.estado)" 
              text-color="white"
              :label="props.row.estado"
            />
          </q-td>
        </template>

        <template #body-cell-fechaFin="props">
          <q-td :props="props">
            <span style="color: #e5e7eb;">{{ props.row.fechaFin || 'Indefinido' }}</span>
          </q-td>
        </template>

        <template #body-cell-salarioContratado="props">
          <q-td :props="props">
            <span style="color: #e5e7eb; font-weight: bold;">${{ parseFloat(props.row.salarioContratado).toFixed(2) }}</span>
          </q-td>
        </template>

        <template #body-cell-acciones="props">
          <q-td :props="props" class="acciones-cell">
            <div class="flex items-center justify-center" style="gap: 4px;">
              <q-btn 
                flat 
                dense 
                round 
                icon="visibility" 
                size="sm" 
                color="primary"
                @click="verContrato(props.row)"
              />
              <q-btn 
                flat 
                dense 
                round 
                icon="edit" 
                size="sm" 
                color="warning"
                @click="editarContrato(props.row)"
              />
              <q-btn 
                flat 
                dense 
                round 
                icon="person_off" 
                size="sm" 
                color="negative"
                @click="cambiarEstadoContrato(props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup name="ContratosPage">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const cargando = ref(true)
const editando = ref(false)
let contratoEnEdicion = null

// Estado del formulario
const formularioInicial = {
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

const formulario = ref({ ...formularioInicial })

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const periodosPrueba = ['15 días', '30 días', '60 días', '90 días', 'Sin período de prueba']

const listaEmpleados = ref([])
const empleadoSeleccionado = ref(null)

const empleadosDisponibles = computed(() => {
  const empleadosConContratoActivo = listaContratos.value
    .filter(c => c.estado === 'Activo')
    .map(c => c.empleadoId)

  return listaEmpleados.value.filter(empleado => {
    // Permitir el empleado actual cuando se edita
    if (
      editando.value &&
      contratoEnEdicion?.empleadoId === empleado.id
    ) {
      return true
    }

    return !empleadosConContratoActivo.includes(empleado.id)
  })
})

const listaContratos = ref([])
const filtroEmpleado = ref('')
const filtroEstado = ref(null)
const filtroVencer = ref(false)

const tiposContrato = ['Por tiempo indefinido', 'Contrato Temporal', 'Por Proyecto', 'Pasantía', 'Consultoría','Servicios Profesionales']
const estadosContrato = ['Activo', 'Pendiente', 'Finalizado', 'Pausado']

// Estados terminales que no permiten cambios
const estadosTerminales = ['Finalizado', 'Despedido', 'Renuncia', 'Suspendido']

// Mapeo de transiciones válidas
const transicionesValidas = {
  'Activo': ['Finalizado', 'Despedido', 'Renuncia', 'Suspendido'],
  'Suspendido': ['Activo', 'Despedido', 'Renuncia'],
  'Finalizado': [],
  'Despedido': [],
  'Renuncia': [],
  'Pendiente': ['Activo', 'Cancelado']
}

const columnasContratos = [
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left', sortable: true },
  { name: 'tipoContrato', label: 'Tipo de Contrato', field: 'tipoContrato', align: 'center', sortable: true },
  { name: 'fechaInicio', label: 'Fecha Inicio', field: 'fechaInicio', align: 'center', sortable: true },
  { name: 'fechaFin', label: 'Fecha Fin', field: 'fechaFin', align: 'center' },
  { name: 'salarioContratado', label: 'Salario', field: 'salarioContratado', align: 'right', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

// Funciones Helper
const getInitials = (nombre) => {
  if (!nombre) return '?'
  const partes = nombre.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase()
  const primerNombre = partes[0].charAt(0).toUpperCase()
  const indiceApellido = partes.length >= 3 ? 2 : 1
  const primerApellido = partes[indiceApellido].charAt(0).toUpperCase()
  return primerNombre + primerApellido
}

const getAvatarColor = (nombre) => {
  if (!nombre) return '#3b82f6'
  
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#3b82f6',
    '#10b981',
    '#8b5cf6',
    '#f97316',
    '#ef4444',
    '#06b6d4',
    '#ec4899'
  ]
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
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
    cargando.value = true
    const res = await fetch('http://localhost:3000/api/contratos')

    const data = await res.json()

    // Validar si viene array
    listaContratos.value = Array.isArray(data) ? data : []

  } catch (error) {
    console.error('Error al cargar contratos:', error)
    listaContratos.value = []
  } finally {
    cargando.value = false
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
  formulario.value = { ...formularioInicial }
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
      horaInicio: formulario.value.horaInicio,
      horaFin: formulario.value.horaFin,
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
      // MENSAJE MODIFICADO SEGÚN REQUISITOS
      $q.notify({
        type: 'positive',
        message: `Contrato guardado como borrador para ${empleadoSeleccionado.value.nombres}.\n\nPara finalizar el proceso debes ingresar al Detalle del Contrato, generar el PDF, obtener la firma del empleado y subir el contrato firmado.`,
        position: 'top',
        timeout: 5000
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

const verContrato = (contrato) => {
  router.push({
    name: 'contrato-detalle',
    params: { id: contrato.id }
  })
}

const editarContrato = (contrato) => {
  if (
    ['Finalizado', 'Despedido', 'Renuncia'].includes(
      contrato.estado
    )
  ) {
    $q.notify({
      type: 'warning',
      message: `No se puede editar un contrato ${contrato.estado}`,
      position: 'top'
    })

    return
  }
  
  contratoEnEdicion = contrato
  empleadoSeleccionado.value = listaEmpleados.value.find(e => e.id === contrato.empleadoId)
  formulario.value = {
    empleado: empleadoSeleccionado.value?.nombres || '',
    departamento: empleadoSeleccionado.value?.departamento?.nombre || '',
    cargo: contrato.cargo || '',
    dui: empleadoSeleccionado.value?.dui || '',
    tipoContrato: contrato.tipoContrato,
    fechaInicio: contrato.fechaInicio,
    fechaFin: contrato.fechaFin || '',
    salarioContratado: contrato.salarioContratado,
    jornada: contrato.jornada,
    horaInicio: contrato.horaInicio || '',
    horaFin: contrato.horaFin || '',
    diasLaborales: contrato.diasLaborales ? contrato.diasLaborales.split(', ') : [],
    periodoPrueba: contrato.periodoPrueba,
    clausulas: contrato.clausulas
  }
  
  editando.value = true
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const actualizarContrato = async () => {
  try {
    if (!contratoEnEdicion) {
      throw new Error('No hay contrato en edición')
    }

    const horario = `${formulario.value.horaInicio} - ${formulario.value.horaFin}`

    const body = {
      tipoContrato: formulario.value.tipoContrato,
      cargo: formulario.value.cargo,
      fechaInicio: formulario.value.fechaInicio,
      fechaFin: formulario.value.fechaFin || null,
      salarioContratado: parseFloat(formulario.value.salarioContratado),
      jornada: formulario.value.jornada,
      horario: horario,
      horaInicio: formulario.value.horaInicio,
      horaFin: formulario.value.horaFin,
      diasLaborales: formulario.value.diasLaborales.join(', '),
      periodoPrueba: formulario.value.periodoPrueba,
      clausulas: formulario.value.clausulas
    }

    const res = await fetch(`http://localhost:3000/api/contratos/${contratoEnEdicion.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (res.ok) {
      $q.notify({
        type: 'positive',
        message: 'Contrato actualizado correctamente',
        position: 'top'
      })

      cancelarEdicion()
      await cargarContratos()
    } else {
      $q.notify({
        type: 'negative',
        message: data.message || 'Error al actualizar contrato'
      })
    }

  } catch (error) {
    console.error('Error en actualizarContrato:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar contrato'
    })
  }
}

const cancelarEdicion = () => {
  formulario.value = { ...formularioInicial }
  empleadoSeleccionado.value = null
  editando.value = false
  contratoEnEdicion = null
}

const cambiarEstadoContrato = (contrato) => {
  // Verificar si el contrato está en estado terminal
  if (estadosTerminales.includes(contrato.estado)) {
    $q.notify({
      type: 'warning',
      message: `No se puede cambiar el estado de un contrato en estado ${contrato.estado}`,
      position: 'top'
    })
    return
  }

  // Obtener estados válidos para la transición
  const estadosValidos = transicionesValidas[contrato.estado] || ['Finalizado', 'Despedido', 'Renuncia', 'Suspendido']
  
  const items = estadosValidos.map(estado => ({
    label: estado,
    value: estado
  }))

  $q.dialog({
    title: 'Cambiar Estado del Contrato',
    message: `¿A qué estado deseas cambiar el contrato de ${contrato.empleado}? (Estado actual: ${contrato.estado})`,
    options: {
      type: 'radio',
      model: contrato.estado,
      items: items
    },
    cancel: true,
    persistent: true
  }).onOk(async (nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/contratos/${contrato.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      })

      if (res.ok) {
        $q.notify({
          type: 'positive',
          message: `Estado actualizado de ${contrato.estado} a ${nuevoEstado}`,
          position: 'top'
        })
        await cargarContratos()
      } else {
        $q.notify({
          type: 'negative',
          message: 'Error al actualizar el estado',
          position: 'top'
        })
      }
    } catch (error) {
      console.error(error)
      $q.notify({
        type: 'negative',
        message: 'Error al actualizar el estado',
        position: 'top'
      })
    }
  })
}

onMounted(async () => {
  await cargarEmpleados()
  await cargarContratos()
  const contratoGuardado = sessionStorage.getItem('contratoEditar')

  if (contratoGuardado) {
    try {
      const contratoData = JSON.parse(contratoGuardado)

      editarContrato(contratoData)

      sessionStorage.removeItem('contratoEditar')

    } catch (error) {
      console.error('Error cargando contrato para edición:', error)
    }
  }
  // Verificar si viene desde registro de empleado
  const empleadoRecienRegistrado = sessionStorage.getItem('empleadoRecienRegistrado')
  
  if (empleadoRecienRegistrado) {
    try {
      const empleadoData = JSON.parse(empleadoRecienRegistrado)
      
      // Esperar un poco a que la lista de empleados esté lista
      setTimeout(() => {
        const empleadoEnLista = listaEmpleados.value.find(e => e.id === empleadoData.id)
        
        if (empleadoEnLista) {
          // Seleccionar el empleado en el formulario
          empleadoSeleccionado.value = empleadoEnLista
          
          // Pre-cargar datos automáticamente
          cargarDatosEmpleado(empleadoEnLista)
          
          // Limpiar el sessionStorage
          sessionStorage.removeItem('empleadoRecienRegistrado')
          
          // Scroll al formulario
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          
          $q.notify({
            type: 'positive',
            message: `Empleado ${empleadoEnLista.nombres} ${empleadoEnLista.apellidos} cargado. Completa el contrato.`,
            position: 'top'
          })
        }
      }, 300)
    } catch (error) {
      console.error('Error al pre-cargar empleado:', error)
    }
  }
})

// Watch para limpiar fechaFin cuando es indefinido
watch(() => formulario.value.tipoContrato, (nuevoTipo) => {
  if (nuevoTipo === 'Por tiempo indefinido') {
    formulario.value.fechaFin = ''
  }
})

// Estadísticas Computed
const contratosActivos = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Activo').length
})

const pendientesFirma = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Borrador').length
})

const finalizados = computed(() => {
  return listaContratos.value.filter(c => c.estado === 'Finalizado').length
})

const porVencer = computed(() => {
  const hoy = new Date()
  const en30Dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return listaContratos.value.filter(contrato => {
    // Solo contar contratos activos con fecha de fin definida
    if (contrato.estado !== 'Activo' || !contrato.fechaFin) return false
    
    const fechaFin = new Date(contrato.fechaFin)
    // Contratos que vencen entre hoy y en 30 días
    return fechaFin >= hoy && fechaFin <= en30Dias
  }).length
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
  const hoy = new Date()
  const en30Dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000)
  
  return listaContratos.value.filter(contrato => {
    const coincideEmpleado = !filtroEmpleado.value || 
      contrato.empleado.toLowerCase().includes(filtroEmpleado.value.toLowerCase())
    
    const coincideEstado = !filtroEstado.value || contrato.estado === filtroEstado.value
    
    // Filtro de vencimiento: si está activado, mostrar solo contratos que vencen en 30 días
    let coincideVencer = true
    if (filtroVencer.value) {
      if (!contrato.fechaFin) {
        coincideVencer = false // No mostrar contratos sin fecha de fin
      } else {
        const fechaFin = new Date(contrato.fechaFin)
        coincideVencer = fechaFin >= hoy && fechaFin <= en30Dias && contrato.estado === 'Activo'
      }
    }

    return coincideEmpleado && coincideEstado && coincideVencer
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

/* LOADING ANIMATIONS */
.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 48px);
  padding: 40px;
  width: 100%;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
