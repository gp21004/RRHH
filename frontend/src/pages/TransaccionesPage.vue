<template>
  <div v-if="loading" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner color="primary" size="60px" />
      <p class="text-subtitle2 text-center q-mt-md">Cargando transacciones...</p>
    </div>
  </div>
  <q-page padding v-else>
    <div class="no-print">
      <q-btn flat icon="arrow_back" label="Volver" color="primary" class="q-mb-lg" to="/" />
      
      <div class="text-h4 text-primary q-mb-lg text-weight-bold">Transacciones y Pagos</div>

      <!-- Tarjetas de Estadísticas (Totales) -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="payments" size="lg" class="text-blue" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">Total Salarios Base</div>
                  <div class="text-h6 text-weight-bold">{{ formatDinero(totales.salarioBase) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-green">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="account_balance_wallet" size="lg" class="text-green" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">Total Salarios Líquidos</div>
                  <div class="text-h6 text-weight-bold">{{ formatDinero(totales.salarioLiquido) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-orange">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="health_and_safety" size="lg" class="text-orange" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">ISSS Patronal (7.5%)</div>
                  <div class="text-h6 text-weight-bold">{{ formatDinero(totales.isssPatronal) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="stat-card stat-card-purple">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="savings" size="lg" class="text-purple" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">AFP Patronal (8.75%)</div>
                  <div class="text-h6 text-weight-bold">{{ formatDinero(totales.afpPatronal) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row q-col-gutter-md q-mb-lg items-end">
        <div class="col-12 col-sm-4 col-md-3">
          <div class="text-caption text-weight-bold q-mb-sm">Buscar Empleado</div>
          <q-input 
            outlined 
            dense 
            placeholder="Nombre del empleado..."
            v-model="filtroEmpleado"
            prefix="search"
            clearable
          />
        </div>
        <div class="col-12 col-sm-4 col-md-3">
          <div class="text-caption text-weight-bold q-mb-sm">Departamento</div>
          <q-select 
            outlined 
            dense 
            v-model="filtroDepartamento"
            :options="['Todos', ...departamentosDisponibles]"
            label="Todos los departamentos"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2">
          <div class="text-caption text-weight-bold q-mb-sm">Año</div>
          <q-select 
            outlined 
            dense 
            v-model="filtroAnio"
            :options="['Todos', ...aniosDisponibles]"
            label="Todos los años"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2">
          <div class="text-caption text-weight-bold q-mb-sm">Mes</div>
          <q-select 
            outlined 
            dense 
            v-model="filtroMes"
            :options="['Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']"
            label="Todos los meses"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-4 col-md-2">
          <q-btn 
            color="primary" 
            label="Limpiar filtros" 
            icon="clear" 
            @click="limpiarFiltros"
            class="full-width"
            outline
          />
        </div>
      </div>

      <!-- Tabla Mejorada -->
      <q-card flat bordered>
        <q-table
          :rows="transaccionesFiltradas"
          :columns="columnas"
          row-key="id"
          flat
          bordered
          :loading="loading"
          no-data-label="No hay transacciones que coincidan con los filtros"
          rows-per-page-label="Registros por página"
          :rows-per-page-options="[10, 25, 50, 100]"
          v-model:pagination="pagination"
        >
          <template v-slot:body-cell-empleadoNombre="props">
            <q-td :props="props">
              <div class="text-weight-bold">{{ props.row.empleadoNombre }}</div>
              <div class="text-caption text-grey-6">{{ props.row.departamento }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-periodo="props">
            <q-td :props="props">
              <q-badge color="grey-2" text-color="grey-8">
                {{ props.row.planillaMes }} {{ props.row.planillaAnio }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-salarioContratado="props">
            <q-td :props="props" class="text-right">
              {{ formatDinero(props.row.salarioContratado) }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-deduccionesEmpleado="props">
            <q-td :props="props" class="text-right text-red-5">
               <q-tooltip class="bg-grey-9">
                 ISSS: {{ formatDinero(props.row.isss) }}<br>
                 AFP: {{ formatDinero(props.row.afp) }}<br>
                 Renta: {{ formatDinero(props.row.renta) }}
               </q-tooltip>
              -{{ formatDinero(props.row.isss + props.row.afp + props.row.renta) }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-deduccionesPatronales="props">
            <q-td :props="props" class="text-right text-orange-6">
               <q-tooltip class="bg-grey-9">
                 ISSS Patronal (7.5%): {{ formatDinero(props.row.isssPatronal) }}<br>
                 AFP Patronal (8.75%): {{ formatDinero(props.row.afpPatronal) }}
               </q-tooltip>
              {{ formatDinero(props.row.isssPatronal + props.row.afpPatronal) }}
            </q-td>
          </template>

          <template v-slot:body-cell-salarioLiquido="props">
            <q-td :props="props" class="text-right">
              <span class="text-weight-bold text-green-7">{{ formatDinero(props.row.salarioLiquido) }}</span>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const transacciones = ref([])
const loading = ref(false)

const pagination = ref({
  rowsPerPage: 10
})

const mesesArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const fechaActual = new Date()

// Filtros
const filtroEmpleado = ref('')
const filtroDepartamento = ref('Todos')
const filtroAnio = ref(fechaActual.getFullYear())
const filtroMes = ref(mesesArray[fechaActual.getMonth()])

const formatDinero = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

const columnas = [
  { name: 'empleadoNombre', label: 'Empleado', field: 'empleadoNombre', align: 'left', sortable: true },
  { name: 'periodo', label: 'Periodo', align: 'center', sortable: true, sort: (a, b, rowA, rowB) => `${rowA.planillaAnio}${rowA.planillaMes}`.localeCompare(`${rowB.planillaAnio}${rowB.planillaMes}`) },
  { name: 'salarioContratado', label: 'Salario Base', field: 'salarioContratado', align: 'right', sortable: true },
  { name: 'deduccionesEmpleado', label: 'Desc. Empleado', align: 'right', sortable: true, sort: (a, b, rowA, rowB) => (rowA.isss + rowA.afp + rowA.renta) - (rowB.isss + rowB.afp + rowB.renta) },
  { name: 'deduccionesPatronales', label: 'Aportes Patronales', align: 'right', sortable: true, sort: (a, b, rowA, rowB) => (rowA.isssPatronal + rowA.afpPatronal) - (rowB.isssPatronal + rowB.afpPatronal) },
  { name: 'salarioLiquido', label: 'Líquido a Pagar', field: 'salarioLiquido', align: 'right', sortable: true }
]

// Opciones de filtros
const departamentosDisponibles = computed(() => {
  const deps = transacciones.value.map(t => t.departamento).filter(Boolean)
  return [...new Set(deps)].sort()
})

const aniosDisponibles = computed(() => {
  const anios = transacciones.value.map(t => t.planillaAnio)
  return [...new Set(anios)].sort((a, b) => b - a)
})

// Lógica de filtrado
const transaccionesFiltradas = computed(() => {
  return transacciones.value.filter(t => {
    const coincideEmpleado = !filtroEmpleado.value || t.empleadoNombre.toLowerCase().includes(filtroEmpleado.value.toLowerCase())
    const coincideDepto = filtroDepartamento.value === 'Todos' || t.departamento === filtroDepartamento.value
    const coincideAnio = filtroAnio.value === 'Todos' || Number(t.planillaAnio) === Number(filtroAnio.value)
    const coincideMes = filtroMes.value === 'Todos' || t.planillaMes === filtroMes.value
    
    return coincideEmpleado && coincideDepto && coincideAnio && coincideMes
  })
})

// Totales reactivos basados en los filtros
const totales = computed(() => {
  return transaccionesFiltradas.value.reduce((acc, t) => {
    acc.salarioBase += t.salarioContratado
    acc.salarioLiquido += t.salarioLiquido
    acc.isssPatronal += t.isssPatronal
    acc.afpPatronal += t.afpPatronal
    return acc
  }, { salarioBase: 0, salarioLiquido: 0, isssPatronal: 0, afpPatronal: 0 })
})

const limpiarFiltros = () => {
  filtroEmpleado.value = ''
  filtroDepartamento.value = 'Todos'
  filtroAnio.value = fechaActual.getFullYear()
  filtroMes.value = mesesArray[fechaActual.getMonth()]
}

const cargarHistorial = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/planillas/historial')
    const planillas = await res.json()
    
    // Aplanar y calcular aportes patronales
    const flatTransacciones = []
    
    planillas.forEach(planilla => {
      if (planilla.detalles && planilla.detalles.length > 0) {
        planilla.detalles.forEach(detalle => {
          const salarioBase = Number(detalle.salarioContratado) || 0
          
          // ISSS Patronal 7.5% con tope de $1000 ($75 max)
          let isssPatronal = salarioBase > 1000 ? 75 : Number((salarioBase * 0.075).toFixed(2))
          
          // AFP Patronal 8.75%
          let afpPatronal = Number((salarioBase * 0.0875).toFixed(2))
          
          flatTransacciones.push({
            ...detalle,
            salarioContratado: salarioBase,
            isss: Number(detalle.isss) || 0,
            afp: Number(detalle.afp) || 0,
            renta: Number(detalle.renta) || 0,
            salarioLiquido: Number(detalle.salarioLiquido) || 0,
            planillaMes: planilla.mes,
            planillaAnio: planilla.anio,
            fechaGeneracion: planilla.fechaGeneracion,
            departamento: detalle.empleado?.departamento?.nombre || 'No Asignado',
            isssPatronal,
            afpPatronal
          })
        })
      }
    })
    
    transacciones.value = flatTransacciones
  } catch (error) {
    console.error('Error al cargar transacciones:', error)
  } finally { 
    loading.value = false 
  }
}

onMounted(cargarHistorial)
</script>

<style lang="scss" scoped>
/* Tarjetas de Estadísticas */
.stat-card {
  transition: all 0.3s ease;
  height: 100%;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.stat-card-blue { border-left: 4px solid #4A90E2; }
.stat-card-green { border-left: 4px solid #10B981; }
.stat-card-orange { border-left: 4px solid #F59E0B; }
.stat-card-purple { border-left: 4px solid #8B5CF6; }

.text-blue { color: #4A90E2 !important; }
.text-green { color: #10B981 !important; }
.text-orange { color: #F59E0B !important; }
.text-purple { color: #8B5CF6 !important; }

/* LOADER ANIMATIONS */
.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
}

.spinner-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
