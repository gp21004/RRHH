<template>
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando gestión de pagos...
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
      <h1 class="text-h4 text-weight-bold q-ma-none q-mb-xs">Gestión de Pagos</h1>
      <p class="text-subtitle2 text-grey-7 q-ma-none">Administra los pagos, novedades y ajustes antes de generar la planilla.</p>
    </div>

    <div class="row items-center justify-end q-mb-lg">
      <div class="col-12 col-md-3">
        <div class="text-subtitle2 text-weight-bold q-mb-sm" style="color: #e5e7eb;">Período de Pago</div>
        <q-select 
          outlined 
          dense
          v-model="periodoSeleccionado" 
          :options="periodos"
          emit-value
          map-options
          style="background: #1f2937; color: #e5e7eb; border-radius: 8px;"
        />
      </div>
    </div>

    <div class="stats-grid q-mb-lg">
      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon positive">
              <q-icon name="people" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ empleadosSeleccionados.length }}</div>
              <div class="stat-label">Empleados Seleccionados</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon warning">
              <q-icon name="edit_note" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ totalNovedades }}</div>
              <div class="stat-label">Novedades Registradas</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section class="q-pa-sm">
          <div class="flex items-center" style="gap: 12px;">
            <div class="stat-icon info">
              <q-icon name="attach_money" size="24px" />
            </div>
            <div class="stat-content-inline">
              <div class="stat-number-small">{{ formatMoney(totalAPagar) }}</div>
              <div class="stat-label">Total a Pagar</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="steps-container q-mb-lg">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step"
        :class="{ active: pasoActual === index, completed: pasoActual > index }"
        @click="pasoActual = index"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-content">
          <div class="step-title">{{ step.titulo }}</div>
          <div class="step-description">{{ step.descripcion }}</div>
        </div>
        <div class="step-icon">
          <svg v-if="pasoActual > index" class="checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="pasoActual === 0" class="paso-content">
      <q-card class="form-card">
        <q-card-section class="q-pa-lg">
          <div class="section-header q-mb-md">
            <q-icon name="people" color="primary" size="24px" />
            <span class="q-ml-md text-subtitle2 text-weight-bold">1. Seleccionar Empleados</span>
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-input 
                outlined 
                dense
                v-model="busquedaEmpleado" 
                label="Buscar empleado..." 
                prefix-icon="search"
                clearable
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select 
                outlined 
                dense
                v-model="departamentoFiltro" 
                :options="departamentos"
                label="Filtrar por departamento"
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select 
                outlined 
                dense
                v-model="estadoPagoFiltro" 
                :options="['Pendientes de pago', 'Pagos finalizados']"
                label="Estado de Pago"
                emit-value
                map-options
              />
            </div>
          </div>

          <q-table 
            :rows="empleadosFiltrados" 
            :columns="columnasEmpleados" 
            row-key="id" 
            flat 
            bordered
            no-data-label="No se encontraron empleados"
            class="empleados-table"
          >
            <template #header-cell-seleccionar="props">
              <q-th :props="props">
                <q-checkbox 
                  :model-value="empleadosSeleccionados.length === empleadosFiltrados.length && empleadosFiltrados.length > 0"
                  @update:model-value="toggleTodos"
                />
              </q-th>
            </template>

            <template #body-cell-seleccionar="props">
              <q-td :props="props">
                <q-checkbox 
                  :model-value="empleadosSeleccionados.includes(props.row.id)"
                  @update:model-value="toggleEmpleado(props.row.id)"
                />
              </q-td>
            </template>

            <template #body-cell-empleado="props">
              <q-td :props="props">
                <div class="row items-center q-gutter-x-sm">
                  
                  <q-avatar 
                    size="md" 
                    text-color="white" 
                    :style="{ backgroundColor: getAvatarColor(props.row.nombre) }"
                    class="text-weight-bold"
                  >
                    {{ getInitials(props.row.nombre) }}
                  </q-avatar>

                  <span class="q-ml-sm text-white">{{ props.row.nombre }}</span>

                </div>
              </q-td>
            </template>

            <template #body-cell-salarioBase="props">
              <q-td :props="props">
                <span style="color: #e5e7eb; font-weight: bold;">${{ parseFloat(props.row.salarioBase).toFixed(2) }}</span>
              </q-td>
            </template>

            <template #body-cell-estado="props">
              <q-td :props="props">
                <q-badge 
                  :color="props.row.estado === 'Activo' ? 'positive' : 'warning'" 
                  text-color="white"
                  :label="props.row.estado"
                />
              </q-td>
            </template>
          </q-table>

          <div class="buttons-section">
            <div class="row q-col-gutter-md">
              <q-space />
              <div class="col-auto">
                <q-btn 
                  label="Siguiente" 
                  color="primary"
                  @click="irAPaso2"
                  :disable="empleadosSeleccionados.length === 0"
                  icon-right="arrow_forward"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="pasoActual === 1" class="paso-content">
      <q-card class="form-card">
        <q-card-section class="q-pa-lg">
          <div class="section-header q-mb-md">
            <q-icon name="edit_note" color="primary" size="24px" />
            <span class="q-ml-md text-subtitle2 text-weight-bold">2. Registrar Novedades</span>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select 
                outlined 
                dense
                v-model="empleadoActual" 
                :options="empleadosSeleccionados.map(id => obtenerEmpleado(id))"
                option-label="nombre"
                option-value="id"
                emit-value
                map-options
                label="Seleccionar Empleado"
              />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div v-if="empleadoActual" class="novedades-form">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input 
                  outlined 
                  dense
                  v-model.number="formularioNovedades.horasExtras" 
                  type="number"
                  step="0.5"
                  label="Horas Extras"
                  prefix="$"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  outlined 
                  dense
                  v-model.number="formularioNovedades.bonificaciones" 
                  type="number"
                  step="0.01"
                  label="Bonificaciones"
                  prefix="$"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  outlined 
                  dense
                  v-model.number="formularioNovedades.tardanzas" 
                  type="number"
                  step="0.01"
                  label="Tardanzas (Descuento)"
                  prefix="$"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  outlined 
                  dense
                  v-model.number="formularioNovedades.ausencias" 
                  type="number"
                  step="0.01"
                  label="Ausencias (Descuento)"
                  prefix="$"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  outlined 
                  dense
                  v-model.number="formularioNovedades.otrosDescuentos" 
                  type="number"
                  step="0.01"
                  label="Otros Descuentos"
                  prefix="$"
                />
              </div>
              <div class="col-12" v-if="requiereJustificante">
                <q-input 
                  outlined 
                  dense
                  v-model="formularioNovedades.justificante" 
                  type="textarea"
                  label="Justificante de modificación (Requerido)"
                  rows="2"
                  color="warning"
                  :rules="[val => !!val || 'El justificante es obligatorio al modificar cálculos automáticos']"
                />
              </div>
              <div class="col-12">
                <q-input 
                  outlined 
                  dense
                  v-model="formularioNovedades.observaciones" 
                  type="textarea"
                  label="Observaciones Generales"
                  rows="2"
                />
              </div>
            </div>

            <div class="buttons-section">
              <div class="row q-col-gutter-md">
                <div class="col-auto">
                  <q-btn label="Guardar Novedades" color="primary" @click="guardarNovedades" />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn label="Anterior" color="grey-7" flat @click="pasoActual = 0" />
                </div>
                <div class="col-auto">
                  <q-btn label="Siguiente" color="primary" @click="irAPaso3" icon-right="arrow_forward" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-if="pasoActual === 2" class="paso-content">
      <q-card class="form-card">
        <q-card-section class="q-pa-lg">
          <div class="section-header q-mb-md">
            <q-icon name="calculate" color="primary" size="24px" />
            <span class="q-ml-md text-subtitle2 text-weight-bold">3. Revisión de Cálculos</span>
          </div>

          <div v-for="empleadoId in empleadosSeleccionados" :key="empleadoId" class="revision-empleado q-mb-lg">
            <div class="revision-header q-mb-md">
              <h3 class="text-weight-bold" style="color: #e5e7eb; margin: 0;">{{ obtenerNombreEmpleado(empleadoId) }}</h3>
              <div class="row items-center q-gutter-sm q-mt-xs">
                <span class="text-subtitle2" style="color: #9ca3af;">{{ obtenerCargoEmpleado(empleadoId) }}</span>
                <q-badge
                  :color="esServiciosProfesionales(empleadoId) ? 'deep-purple' : 'blue-8'"
                  text-color="white"
                  :label="obtenerEmpleado(empleadoId)?.tipoContrato || 'Sin tipo'"
                  class="q-ml-sm"
                />
              </div>
            </div>

            <div class="calculo-breakdown">
              <div class="calculo-row salario-base">
                <span class="label">Salario Base</span>
                <span class="valor">{{ formatMoney(obtenerSalarioBase(empleadoId)) }}</span>
              </div>

              <div class="calculo-section">
                <div class="section-title">Ingresos Adicionales</div>
                <div class="calculo-row positivo">
                  <span class="label">+ Horas Extras</span>
                  <span class="valor">{{ formatMoney(novedades[empleadoId]?.horasExtras || 0) }}</span>
                </div>
                <div class="calculo-row positivo">
                  <span class="label">+ Bonificaciones</span>
                  <span class="valor">{{ formatMoney(novedades[empleadoId]?.bonificaciones || 0) }}</span>
                </div>
              </div>

              <div class="calculo-section">
                <div class="section-title">Descuentos</div>
                <div class="calculo-row negativo">
                  <span class="label">- Tardanzas</span>
                  <span class="valor">{{ formatMoney(novedades[empleadoId]?.tardanzas || 0) }}</span>
                </div>
                <div class="calculo-row negativo">
                  <span class="label">- Ausencias</span>
                  <span class="valor">{{ formatMoney(novedades[empleadoId]?.ausencias || 0) }}</span>
                </div>
                <div class="calculo-row negativo">
                  <span class="label">- Otros Descuentos</span>
                  <span class="valor">{{ formatMoney(novedades[empleadoId]?.otrosDescuentos || 0) }}</span>
                </div>
              </div>

              <div class="calculo-separator"></div>

              <div class="calculo-row gravable">
                <span class="label">= Salario Gravable</span>
                <span class="valor">{{ formatMoney(calcularSalarioGravable(empleadoId)) }}</span>
              </div>

              <div class="calculo-section">
                <div class="section-title">Descuentos Legales</div>

                <!-- ISSS -->
                <div class="calculo-row" :class="calcularISS(empleadoId) === null ? 'na-row' : 'negativo'">
                  <span class="label">- ISSS (3%)</span>
                  <span v-if="calcularISS(empleadoId) === null" class="valor na-badge">N/A</span>
                  <span v-else class="valor">{{ formatMoney(calcularISS(empleadoId)) }}</span>
                </div>

                <!-- AFP -->
                <div class="calculo-row" :class="calcularAFP(empleadoId) === null ? 'na-row' : 'negativo'">
                  <span class="label">- AFP (7.25%)</span>
                  <span v-if="calcularAFP(empleadoId) === null" class="valor na-badge">N/A</span>
                  <span v-else class="valor">{{ formatMoney(calcularAFP(empleadoId)) }}</span>
                </div>

                <!-- ISR -->
                <div class="calculo-row negativo">
                  <span class="label">
                    - ISR {{ esServiciosProfesionales(empleadoId) ? '(10% Honorarios)' : '' }}
                  </span>
                  <span class="valor">{{ formatMoney(calcularISR(empleadoId)) }}</span>
                </div>
              </div>

              <div class="calculo-separator"></div>

              <div class="calculo-row liquido">
                <span class="label">= Salario Líquido</span>
                <span class="valor">{{ formatMoney(calcularSalarioLiquido(empleadoId)) }}</span>
              </div>
            </div>
          </div>

          <div class="buttons-section">
            <div class="row q-col-gutter-md">
              <div class="col-auto">
                <q-btn label="Cancelar" color="negative" flat @click="cancelarProceso" />
              </div>
              <q-space />
              <div class="col-auto">
                <q-btn label="Anterior" color="grey-7" flat @click="pasoActual = 2" />
              </div>
              <div class="col-auto">
                <q-btn label="Generar Planilla" color="positive" @click="generarPlanilla" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-lg">
      <q-card class="stat-card">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 text-weight-bold q-mb-md" style="color: #e5e7eb;">Resumen de Selección</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <div class="resumen-item">
                <q-icon name="people" color="primary" size="32px" />
                <div class="q-mt-sm">
                  <div class="text-subtitle2" style="color: #9ca3af;">Empleados</div>
                  <div class="text-h6" style="color: #e5e7eb;">{{ empleadosSeleccionados.length }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="resumen-item">
                <q-icon name="attach_money" color="info" size="32px" />
                <div class="q-mt-sm">
                  <div class="text-subtitle2" style="color: #9ca3af;">Total Salarios</div>
                  <div class="text-h6" style="color: #e5e7eb;">{{ formatMoney(calcularTotalSalarios()) }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="resumen-item">
                <q-icon name="edit_note" color="warning" size="32px" />
                <div class="q-mt-sm">
                  <div class="text-subtitle2" style="color: #9ca3af;">Total Novedades</div>
                  <div class="text-h6" style="color: #e5e7eb;">{{ formatMoney(calcularTotalNovedadesGlobal()) }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-3">
              <div class="resumen-item">
                <q-icon name="check_circle" color="positive" size="32px" />
                <div class="q-mt-sm">
                  <div class="text-subtitle2" style="color: #9ca3af;">Total a Pagar</div>
                  <div class="text-h6" style="color: #e5e7eb;">{{ formatMoney(totalAPagar) }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup name="GestionPagosPage">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const cargando = ref(true)
const pasoActual = ref(0)

// Estado
const generarPeriodos = () => {
  const periodosArr = []
  const fechaActual = new Date()
  const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  // Generar los últimos 12 meses
  for (let i = 0; i < 12; i++) {
    const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1)
    periodosArr.push(`${mesesNombres[d.getMonth()]} ${d.getFullYear()}`)
  }
  return periodosArr
}

const periodos = generarPeriodos()
const periodoSeleccionado = ref(periodos[0])

const listaEmpleados = ref([])

const cargarEmpleados = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/empleados')
    const data = await res.json()
    listaEmpleados.value = data.map(e => ({
      id: e.id,
      nombre: e.nombres + ' ' + e.apellidos,
      dui: e.dui,
      cargo: e.contratos?.[0]?.cargo || 'Sin cargo',
      departamento: e.departamento?.nombre || 'Sin departamento',
      salarioBase: parseFloat(e.contratos?.[0]?.salarioContratado || 0),
      contratoId: e.contratos?.[0]?.id || null,
      tipoContrato: e.contratos?.[0]?.tipoContrato || '',
      estado: e.estado ? 'Activo' : 'Inactivo'
    }))
  } catch (error) {
    console.error('Error al cargar empleados', error)
  }
}

const empleadosSeleccionados = ref([])
const busquedaEmpleado = ref('')
const departamentoFiltro = ref('')
const estadoPagoFiltro = ref('Pendientes de pago')
const empleadosPagadosPeriodo = ref([])

const verificarPagosPeriodo = async () => {
  try {
    const [mesTxt, anioTxt] = periodoSeleccionado.value.split(' ')
    const mesesMapLocal = { 'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4, 'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8, 'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12 }
    const mes = mesesMapLocal[mesTxt] || 5
    const anio = parseInt(anioTxt) || 2025

    const res = await fetch(`http://localhost:3000/api/planillas/verificar/${mes}/${anio}`)
    const data = await res.json()
    empleadosPagadosPeriodo.value = data
  } catch (error) {
    console.error('Error al verificar pagos del periodo', error)
  }
}

const empleadoActual = ref(null)
const formularioNovedadesOriginal = ref(null)
const formularioNovedades = ref({
  horasExtras: 0,
  bonificaciones: 0,
  tardanzas: 0,
  ausencias: 0,
  otrosDescuentos: 0,
  observaciones: '',
  justificante: ''
})

const novedades = ref({})

const steps = [
  { titulo: '1. Seleccionar Empleados', descripcion: 'Elige a cuáles empleados les procesarás la planilla' },
  { titulo: '2. Registrar Novedades', descripcion: 'Horas extras, tardanzas, ausencias, etc.' },
  { titulo: '3. Revisar Cálculos', descripcion: 'Revisa los descuentos, bonificaciones y salario líquido' },
  { titulo: '4. Generar Planilla', descripcion: 'Confirma y genera la planilla mensual' }
]

const columnasEmpleados = [
  { name: 'seleccionar', label: '', field: 'seleccionar', align: 'left' },
  { name: 'empleado', label: 'Empleado', field: 'nombre', align: 'left' },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'left' },
  { name: 'salarioBase', label: 'Salario Base', field: 'salarioBase', align: 'right' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' }
]

// Computed
const departamentos = computed(() => {
  return [...new Set(listaEmpleados.value.map(e => e.departamento))]
})

const empleadosFiltrados = computed(() => {
  return listaEmpleados.value.filter(e => {
    const coincideBusqueda = e.nombre.toLowerCase().includes(busquedaEmpleado.value.toLowerCase())
    const coincideDepartamento = !departamentoFiltro.value || e.departamento === departamentoFiltro.value
    
    const estaPagado = empleadosPagadosPeriodo.value.includes(e.id)
    const coincideEstadoPago = estadoPagoFiltro.value === 'Pagos finalizados' ? estaPagado : !estaPagado

    return coincideBusqueda && coincideDepartamento && coincideEstadoPago
  })
})

const totalNovedades = computed(() => {
  return empleadosSeleccionados.value.length
})

const totalAPagar = computed(() => {
  return empleadosSeleccionados.value.reduce((sum, id) => {
    return sum + calcularSalarioLiquido(id)
  }, 0)
})

// Métodos
// Obtiene la inicial del primer nombre y primer apellido
const getInitials = (nombre) => {
  if (!nombre) return '?';
  const partes = nombre.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  
  const primerNombre = partes[0].charAt(0).toUpperCase();
  const indiceApellido = partes.length >= 3 ? 2 : 1;
  const primerApellido = partes[indiceApellido].charAt(0).toUpperCase();
  return primerNombre + primerApellido;
};

// Devuelve un único color sólido y plano basado en el nombre
const getAvatarColor = (nombre) => {
  if (!nombre) return '#3b82f6'; // Azul por defecto si no hay nombre
  
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Colores sólidos, limpios y sencillos
  const colors = [
    '#3b82f6', // Azul
    '#10b981', // Verde
    '#8b5cf6', // Morado
    '#f97316', // Naranja
    '#ef4444', // Rojo
    '#06b6d4', // Cian
    '#ec4899'  // Rosa
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const toggleEmpleado = (id) => {
  const index = empleadosSeleccionados.value.indexOf(id)
  if (index > -1) {
    empleadosSeleccionados.value.splice(index, 1)
  } else {
    empleadosSeleccionados.value.push(id)
  }
}

const toggleTodos = () => {
  if (empleadosSeleccionados.value.length === empleadosFiltrados.value.length) {
    empleadosSeleccionados.value = []
  } else {
    empleadosSeleccionados.value = empleadosFiltrados.value.map(e => e.id)
  }
}

const mesesMap = { 'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4, 'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8, 'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12 }

watch(periodoSeleccionado, () => {
  // Limpiar novedades en caché cuando cambia el periodo
  novedades.value = {}
  empleadosSeleccionados.value = []
  verificarPagosPeriodo()
})

const irAPaso2 = async () => {
  pasoActual.value = 1;
  const [mesTxt, anioTxt] = periodoSeleccionado.value.split(' ')
  const mes = mesesMap[mesTxt] || 5
  const anio = parseInt(anioTxt) || 2025
  
  for (const id of empleadosSeleccionados.value) {
    if (!novedades.value[id]) {
      try {
        const res = await fetch(`http://localhost:3000/api/marcaciones/resumen/${id}/${mes}/${anio}`)
        const data = await res.json()
        novedades.value[id] = {
          horasExtras: parseFloat(data.horasExtrasMoneda) || 0,
          tardanzas: parseFloat(data.tardanzasMoneda) || 0,
          ausencias: parseFloat(data.ausenciasMoneda) || 0,
          bonificaciones: 0,
          otrosDescuentos: 0,
          observaciones: '',
          justificante: ''
        }
      } catch(e) { console.error('Error pre-cargando novedades para', id, e) }
    }
  }
}

const autoCargarNovedades = (id) => {
  if (!id) return;
  const nov = novedades.value[id]
  if (nov) {
    formularioNovedades.value = { ...nov }
    formularioNovedadesOriginal.value = { ...nov }
  }
}

watch(empleadoActual, (newId) => {
  if (newId) {
    autoCargarNovedades(newId)
  } else {
    formularioNovedadesOriginal.value = null
  }
})

const requiereJustificante = computed(() => {
  if (!formularioNovedadesOriginal.value) return false;
  return formularioNovedades.value.horasExtras !== formularioNovedadesOriginal.value.horasExtras ||
         formularioNovedades.value.tardanzas !== formularioNovedadesOriginal.value.tardanzas ||
         formularioNovedades.value.ausencias !== formularioNovedadesOriginal.value.ausencias;
})

const obtenerEmpleado = (id) => {
  return listaEmpleados.value.find(e => e.id === id)
}

const obtenerNombreEmpleado = (id) => {
  return obtenerEmpleado(id)?.nombre || ''
}

const obtenerCargoEmpleado = (id) => {
  return obtenerEmpleado(id)?.cargo || ''
}

const obtenerSalarioBase = (id) => {
  return obtenerEmpleado(id)?.salarioBase || 0
}

const guardarNovedades = () => {
  if (empleadoActual.value) {
    if (requiereJustificante.value && !formularioNovedades.value.justificante) {
      $q.notify({ type: 'negative', message: 'Debe ingresar un justificante por modificar los cálculos automáticos', position: 'top' })
      return false;
    }
    novedades.value[empleadoActual.value] = { ...formularioNovedades.value }
    formularioNovedades.value = {
      horasExtras: 0,
      bonificaciones: 0,
      tardanzas: 0,
      ausencias: 0,
      otrosDescuentos: 0,
      observaciones: '',
      justificante: ''
    }
    formularioNovedadesOriginal.value = null
    empleadoActual.value = null
    return true;
  }
  return true;
}

const irAPaso3 = () => {
  if (empleadoActual.value) {
    const success = guardarNovedades();
    if (!success) return; // Se detiene si hay error de validación
  }
  pasoActual.value = 2;
}

const calcularSalarioGravable = (empleadoId) => {
  const salarioBase = obtenerSalarioBase(empleadoId)
  const nov = novedades.value[empleadoId] || {}
  
  return salarioBase + 
         (nov.horasExtras || 0) + 
         (nov.bonificaciones || 0) - 
         (nov.tardanzas || 0) - 
         (nov.ausencias || 0) - 
         (nov.otrosDescuentos || 0)
}

// ─── Helpers de tipo de contrato ─────────────────────────────────────────────
const esServiciosProfesionales = (empleadoId) => {
  const tipo = (obtenerEmpleado(empleadoId)?.tipoContrato || '').toLowerCase()
  return tipo.includes('servicio') || tipo.includes('profesional')
}

// ─── Cálculos de descuentos ───────────────────────────────────────────────────
const calcularISS = (empleadoId) => {
  if (esServiciosProfesionales(empleadoId)) return null   // N/A
  const salario = calcularSalarioGravable(empleadoId)
  return salario > 1000 ? 30 : Number((salario * 0.03).toFixed(2))
}

const calcularAFP = (empleadoId) => {
  if (esServiciosProfesionales(empleadoId)) return null   // N/A
  return Number((calcularSalarioGravable(empleadoId) * 0.0725).toFixed(2))
}

const calcularISR = (empleadoId) => {
  const salarioGravable = calcularSalarioGravable(empleadoId)
  if (salarioGravable <= 0) return 0

  if (esServiciosProfesionales(empleadoId)) {
    // Servicios Profesionales: ISR fijo 10%
    return Number((salarioGravable * 0.10).toFixed(2))
  }

  // Contrato normal: ISR por tablas (base imponible luego de ISSS y AFP)
  const isss = calcularISS(empleadoId)
  const afp  = calcularAFP(empleadoId)
  const rentaImponible = salarioGravable - isss - afp
  let isr = 0
  if (rentaImponible > 550 && rentaImponible <= 895.24) {
    isr = (rentaImponible - 550) * 0.10 + 17.67
  } else if (rentaImponible > 895.24 && rentaImponible <= 2038.10) {
    isr = (rentaImponible - 895.24) * 0.20 + 60
  } else if (rentaImponible > 2038.10) {
    isr = (rentaImponible - 2038.10) * 0.30 + 288.57
  }
  return Number(isr.toFixed(2))
}

const calcularSalarioLiquido = (empleadoId) => {
  const gravable = calcularSalarioGravable(empleadoId)
  const isss = calcularISS(empleadoId) ?? 0
  const afp  = calcularAFP(empleadoId) ?? 0
  const isr  = calcularISR(empleadoId)
  return Number((gravable - isss - afp - isr).toFixed(2))
}

const calcularTotalSalarios = () => {
  return empleadosSeleccionados.value.reduce((sum, id) => {
    return sum + obtenerSalarioBase(id)
  }, 0)
}

const calcularTotalNovedadesGlobal = () => {
  return empleadosSeleccionados.value.reduce((sum, id) => {
    const nov = novedades.value[id] || {}
    return sum + (nov.horasExtras || 0) + (nov.bonificaciones || 0) - 
           (nov.tardanzas || 0) - (nov.ausencias || 0) - (nov.otrosDescuentos || 0)
  }, 0)
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-SV', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const cancelarProceso = () => {
  empleadosSeleccionados.value = []
  novedades.value = {}
  pasoActual.value = 0
}

const generarPlanilla = async () => {
  try {
    const [mesTxt, anioTxt] = periodoSeleccionado.value.split(' ')
    const anio = parseInt(anioTxt) || 2025

    const detalles = empleadosSeleccionados.value.map(id => {
      const empleado = obtenerEmpleado(id)
      const salarioBase = obtenerSalarioBase(id)
      const isss = calcularISS(id)   // null si N/A
      const afp  = calcularAFP(id)   // null si N/A
      return {
        empleadoId: id,
        contratoId: empleado.contratoId || 0,
        empleadoNombre: empleado.nombre,
        salarioBase: salarioBase,
        isss: isss ?? 0,
        afp:  afp  ?? 0,
        renta: calcularISR(id),
        salarioLiquido: calcularSalarioLiquido(id)
      }
    })

    const payload = {
      mes: mesTxt,
      anio,
      detalles
    }

    const res = await fetch('http://localhost:3000/api/planillas/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Error en el servidor')

    $q.notify({
      type: 'positive',
      message: 'Planilla generada exitosamente',
      position: 'top'
    })
    
    await verificarPagosPeriodo()
    cancelarProceso()
  } catch (error) {
    console.error('Error al generar planilla:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al generar la planilla',
      position: 'top'
    })
  }
}

onMounted(async () => {
  cargando.value = true
  await cargarEmpleados()
  await verificarPagosPeriodo()
  cargando.value = false
})
</script>

<style scoped>
/* Colores oscuros de fondo */
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --card-bg: #1f2937;
}

.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-primary);
}

.spinner-wrapper {
  text-align: center;
}

.text-center {
  text-align: center;
}

/* Step Container */
.steps-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  min-width: 280px;
  background: rgba(30, 41, 59, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.step:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(30, 41, 59, 1);
}

.step.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.step.completed {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.05);
}

.step-number {
  width: 40px;
  height: 40px;
  background: rgba(107, 114, 128, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-primary);
  flex-shrink: 0;
}

.step.active .step-number {
  background: #3b82f6;
  color: white;
}

.step.completed .step-number {
  background: #22c55e;
  color: white;
}

.step-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.step-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.checkmark, .arrow {
  width: 24px;
  height: 24px;
  stroke-width: 3;
}

/* Cards */
.q-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: var(--text-primary);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.stat-card {
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%);
  border: 1px solid rgba(148, 163, 184, 0.15);
  backdrop-filter: blur(10px);
}

.form-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon.info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-number-small {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Sección Header */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header .text-subtitle2 {
  color: var(--text-primary);
}

/* Tabla */
.q-table__card {
  background: transparent;
  box-shadow: none;
}

.q-table thead tr {
  background: rgba(107, 114, 128, 0.1);
}

.q-table tbody tr {
  border-color: rgba(148, 163, 184, 0.1);
}

.q-table__body-cell {
  color: var(--text-primary);
}

.q-table__body-cell--editing {
  background: rgba(59, 130, 246, 0.1);
}

/* Inputs */
.q-input__control,
.q-select__content {
  color: var(--text-primary);
}

:deep(.q-field__control) {
  color: var(--text-primary);
}

:deep(.q-field__label) {
  color: var(--text-secondary);
}

:deep(.q-field__native, .q-field__input) {
  color: var(--text-primary);
}

/* Botones */
.q-btn {
  text-transform: capitalize;
  font-weight: 500;
}

/* Botones Section */
.buttons-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

/* Cálculo Breakdown */
.calculo-breakdown {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.calculo-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.calculo-row .label {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.calculo-row .valor {
  font-weight: 600;
  text-align: right;
}

.calculo-row.salario-base {
  font-weight: 600;
  border-bottom: 2px solid rgba(59, 130, 246, 0.3);
  padding: 1rem 0;
}

.calculo-row.positivo .valor {
  color: #22c55e;
}

.calculo-row.negativo .valor {
  color: #ef4444;
}

.calculo-row.na-row {
  opacity: 0.6;
}

.na-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6b7280;
  background: rgba(107, 114, 128, 0.15);
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 4px;
  padding: 1px 8px;
  letter-spacing: 0.05em;
}

.calculo-row.gravable {
  background: rgba(59, 130, 246, 0.1);
  padding: 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  margin: 1rem 0;
}

.calculo-row.liquido {
  background: rgba(34, 197, 94, 0.1);
  padding: 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
}

.calculo-section {
  margin: 1rem 0;
}

.section-title {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.calculo-separator {
  height: 2px;
  background: rgba(148, 163, 184, 0.2);
  margin: 1rem 0;
}

/* Resumen Item */
.resumen-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

/* Revisión Empleado */
.revision-empleado {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
}

.revision-header {
  margin-bottom: 1rem;
}

.revision-header h3 {
  margin: 0;
  color: var(--text-primary);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Paso Content */
.paso-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .steps-container {
    flex-wrap: wrap;
  }

  .step {
    min-width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .resumen-item {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .resumen-item .q-icon {
    margin-right: 1rem;
  }
}
</style>