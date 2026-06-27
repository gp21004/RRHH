<template>
  <!-- LOADER MIENTRAS CARGA -->
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando detalles de la planilla...
      </div>
    </div>
  </div>

  <!-- Contenido -->
  <q-page padding v-else>
    <!-- Header con navegación -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">Detalles de Planilla</h1>
        <div class="text-subtitle2 text-grey">
          Inicio / Historial de Planillas / Detalles
        </div>
      </div>
      <q-btn
        flat
        outline
        icon="arrow_back"
        label="Volver al historial"
        color="primary"
        @click="$router.back()"
      />
    </div>

    <!-- Información de la Planilla -->
    <q-card flat bordered class="q-mb-lg info-card">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-icon name="description" color="primary" size="md" class="q-mr-sm" />
          <span class="text-h6 text-weight-bold">Información de la Planilla</span>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <div class="info-field">
              <q-icon name="calendar_month" color="primary" size="sm" class="q-mr-xs" />
              <span class="label">Mes</span>
              <div class="value">{{ planilla.mes }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <div class="info-field">
              <q-icon name="calendar_today" color="primary" size="sm" class="q-mr-xs" />
              <span class="label">Año</span>
              <div class="value">{{ planilla.anio }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <div class="info-field">
              <q-icon name="schedule" color="primary" size="sm" class="q-mr-xs" />
              <span class="label">Fecha de Generación</span>
              <div class="value">{{ formatFecha(planilla.fechaGeneracion) }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-2">
            <div class="info-field">
              <q-icon name="check_circle" color="positive" size="sm" class="q-mr-xs" />
              <span class="label">Estado</span>
              <q-badge color="positive" label="Pagada" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Detalle de Empleados -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <h3 class="text-h6 text-weight-bold q-my-none q-mb-md">Detalle de Empleados</h3>

        <q-table
          :rows="planilla.detalles || []"
          :columns="columnasPlanilla"
          row-key="id"
          flat
          bordered
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
          class="tabla-planilla"
        >
          <template v-slot:body-cell-numero="props">
            <q-td :props="props" class="text-weight-bold">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <template v-slot:body-cell-empleado="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar
                  :src="props.row.empleadoFoto || 'https://via.placeholder.com/40'"
                  size="40px"
                />
                <div>
                  <div class="text-weight-bold">{{ props.row.empleadoNombre }}</div>
                  <div class="text-caption text-grey">{{ props.row.empleadoCargo }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-salarioContratado="props">
            <q-td :props="props" class="text-right">
              {{ formatDinero(props.row.salarioContratado) }}
            </q-td>
          </template>

          <template v-slot:body-cell-isss="props">
            <q-td :props="props" class="text-right">
              {{ formatDinero(props.row.isss) }}
            </q-td>
          </template>

          <template v-slot:body-cell-afp="props">
            <q-td :props="props" class="text-right">
              {{ formatDinero(props.row.afp) }}
            </q-td>
          </template>

          <template v-slot:body-cell-renta="props">
            <q-td :props="props" class="text-right">
              {{ formatDinero(props.row.renta) }}
            </q-td>
          </template>

          <template v-slot:body-cell-salarioLiquido="props">
            <q-td :props="props" class="text-right text-weight-bold text-positive">
              {{ formatDinero(props.row.salarioLiquido) }}
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="primary"
                size="sm"
                @click="verDetalleEmpleado(props.row.empleadoId)"
              >
                <q-tooltip>Ver detalle del empleado</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Resumen de Totales -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-2.4">
        <div class="total-card">
          <q-icon name="attach_money" size="md" color="primary" />
          <div class="label">Total Salarios</div>
          <div class="value">{{ formatDinero(totales.salarios) }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-2.4">
        <div class="total-card">
          <q-icon name="health_and_safety" size="md" color="orange" />
          <div class="label">Total ISSS (3%)</div>
          <div class="value">{{ formatDinero(totales.isss) }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-2.4">
        <div class="total-card">
          <q-icon name="savings" size="md" color="blue" />
          <div class="label">Total AFP (7.25%)</div>
          <div class="value">{{ formatDinero(totales.afp) }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-2.4">
        <div class="total-card">
          <q-icon name="receipt" size="md" color="purple" />
          <div class="label">Total Renta (ISR)</div>
          <div class="value">{{ formatDinero(totales.renta) }}</div>
        </div>
      </div>
      <div class="col-12 col-sm-6 col-md-2.4">
        <div class="total-card total-pagar">
          <q-icon name="wallet" size="md" color="positive" />
          <div class="label">Total a Pagar</div>
          <div class="value text-positive">{{ formatDinero(totales.totalPagar) }}</div>
        </div>
      </div>
    </div>

    <!-- Acciones -->
    <div class="row q-gutter-md justify-center q-mb-lg">
      <q-btn
        label="Imprimir"
        color="primary"
        icon="print"
        @click="imprimirPDF"
      />
      <q-btn
        label="Exportar PDF"
        color="positive"
        icon="download"
        @click="exportarPDF"
      />
      <q-btn
        label="Cerrar"
        flat
        color="negative"
        icon="close"
        @click="$router.back()"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { generarPlanillaPDF } from 'src/utils/pdfGenerator'



const route = useRoute()
const $router = useRouter()
const $q = useQuasar()

const cargando = ref(true)
const planilla = ref({
  mes: '',
  anio: '',
  fechaGeneracion: '',
  detalles: []
})

const columnasPlanilla = [
  { name: 'numero', label: '#', field: 'numero', align: 'center', style: 'width: 40px' },
  { name: 'empleado', label: 'Empleado', field: 'empleado', align: 'left' },
  { name: 'salarioContratado', label: 'Salario Contratado', field: 'salarioContratado', align: 'right' },
  { name: 'isss', label: 'ISSS (3%)', field: 'isss', align: 'right' },
  { name: 'afp', label: 'AFP (7.25%)', field: 'afp', align: 'right' },
  { name: 'renta', label: 'Renta (ISR)', field: 'renta', align: 'right' },
  { name: 'salarioLiquido', label: 'Salario Líquido', field: 'salarioLiquido', align: 'right' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center', style: 'width: 80px' }
]

const formatDinero = (valor) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor)
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' ' + new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const totales = computed(() => {
  const detalles = planilla.value.detalles || []
  return {
    salarios: detalles.reduce((acc, item) => acc + Number(item.salarioContratado), 0),
    isss: detalles.reduce((acc, item) => acc + Number(item.isss), 0),
    afp: detalles.reduce((acc, item) => acc + Number(item.afp), 0),
    renta: detalles.reduce((acc, item) => acc + Number(item.renta), 0),
    totalPagar: detalles.reduce((acc, item) => acc + Number(item.salarioLiquido), 0)
  }
})

const cargarPlanilla = async () => {
  try {
    cargando.value = true
    const planillaId = route.params.id
    const res = await fetch(`http://localhost:3000/api/planillas/historial/${planillaId}`)
    
    if (!res.ok) {
      throw new Error('Error al cargar la planilla')
    }
    
    planilla.value = await res.json()
    console.log('PLANILLA:', planilla.value)
    console.log('DETALLES:', planilla.value.detalles)
  } catch (error) {
    console.error('Error al cargar planilla:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los detalles de la planilla'
    })
  } finally {
    cargando.value = false
  }
}

const imprimirPDF = () => {
  generarPlanillaPDF(planilla.value, 'print')
}

const exportarPDF = () => {
  generarPlanillaPDF(planilla.value, 'download')
}

const verDetalleEmpleado = (empleadoId) => {
  $router.push({
    name: 'detalle-empleado-planilla',
    params: {
      planillaId: route.params.id,
      empleadoId
    }
  })
}

onMounted(cargarPlanilla)
</script>

<style scoped lang="scss">
.info-card {
  background-color: #1e293b;
  border-left: 4px solid var(--q-primary);
}

.info-field {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: #2d3748;
  border-radius: 4px;
  border: 1px solid #3d4558;

  .label {
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 4px;
    text-transform: uppercase;
    font-weight: 600;
  }

  .value {
    font-size: 16px;
    font-weight: bold;
    color: #e2e8f0;
  }
}

.tabla-planilla {
  :deep(th) {
    background-color: #2d3748;
    font-weight: 600;
    color: #e2e8f0;
    border-bottom: 2px solid #475569;
  }

  :deep(td) {
    padding: 12px 8px;
    color: #cbd5e1;
  }

  :deep(tbody tr:hover) {
    background-color: #374151;
  }
}

.total-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #2d3748;
  border: 1px solid #3d4558;
  border-radius: 4px;
  text-align: center;
  transition: all 0.3s ease;

  :deep(svg) {
    color: var(--q-primary);
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border-color: var(--q-primary);
  }

  .label {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 8px;
    margin-bottom: 4px;
    font-weight: 600;
  }

  .value {
    font-size: 18px;
    font-weight: bold;
    color: #e2e8f0;
  }

  &.total-pagar {
    background-color: #1a3d2a;
    border-color: var(--q-positive);

    .value {
      color: var(--q-positive);
    }
  }
}

/* LOADING ANIMATIONS */
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
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.text-subtitle2 {
  color: #e5e7eb;
}

.text-center {
  text-align: center;
}
/* Estilos para impresión */
@media print {
  @page {
    size: letter landscape;
    margin: 10mm;
  }

  body, html, .q-page {
    background-color: white !important;
  }

  * {
    color: black !important;
    text-shadow: none !important;
  }

  .q-page {
    padding: 0 !important;
  }

  .row.q-gutter-md.justify-center.q-mb-lg, 
  .q-btn, 
  .row.items-center.justify-between {
    display: none !important;
  }

  .info-card, .info-field, .total-card, .q-card {
    background-color: transparent !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
  
  .tabla-planilla {
    font-size: 10pt;
    border: 1px solid #ccc !important;
  }

  .tabla-planilla :deep(th),
  .tabla-planilla :deep(td) {
    border-bottom: 1px solid #ccc !important;
    color: black !important;
    background-color: transparent !important;
  }
}
</style>
