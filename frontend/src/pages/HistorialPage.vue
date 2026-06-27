<template>
 <!-- LOADER MIENTRAS CARGA -->
  <div v-if="loading" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner color="primary" size="60px" />
      <p class="text-subtitle2 text-center q-mt-md">Cargando historial...</p>
    </div>
  </div>
  <q-page padding>
    <div class="no-print">
      <q-btn flat icon="arrow_back" label="Volver" color="primary" class="q-mb-lg" to="/" />
      
      <div class="text-h4 text-primary q-mb-lg text-weight-bold">Historial de Planillas</div>

      <!-- Tarjetas de Estadísticas -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6">
          <q-card flat bordered class="stat-card stat-card-blue">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="description" size="lg" class="text-blue" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">Total de Planillas</div>
                  <div class="text-h5 text-weight-bold">{{ totalPlanillas }}</div>
                  <div class="text-caption text-grey-6">Registros en total</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6">
          <q-card flat bordered class="stat-card stat-card-green">
            <q-card-section class="q-pa-md">
              <div class="row items-start q-gutter-md">
                <div class="col-auto">
                  <q-icon name="event_note" size="lg" class="text-green" />
                </div>
                <div class="col">
                  <div class="text-caption text-grey-7">Este Año</div>
                  <div class="text-h5 text-weight-bold">{{ planillasEsteAnio }}</div>
                  <div class="text-caption text-grey-6">Planillas generadas</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row q-col-gutter-md q-mb-lg items-end">
        <div class="col-12 col-sm-6 col-md-4">
          <div class="text-caption text-weight-bold q-mb-sm">Buscar</div>
          <q-input 
            outlined 
            dense 
            placeholder="Buscar por mes o año..."
            v-model="busqueda"
            prefix="search"
            clearable
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-caption text-weight-bold q-mb-sm">Año</div>
          <q-select 
            outlined 
            dense 
            v-model="filtroAnio"
            :options="['Todos los años', ...aniosDisponibles]"
            label="Todos los años"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <div class="text-caption text-weight-bold q-mb-sm">Estado</div>
          <q-select 
            outlined 
            dense 
            v-model="filtroEstado"
            :options="['Todos los estados', 'Pagada', 'Pendiente', 'Atrasada']"
            label="Todos los estados"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-sm-6 col-md-2">
          <q-btn 
            color="primary" 
            label="Limpiar filtros" 
            icon="clear" 
            @click="limpiarFiltros"
            class="full-width"
          />
        </div>
      </div>

      <!-- Tabla Mejorada -->
      <q-card flat bordered>
        <q-table
          :rows="historialFiltrado"
          :columns="columnas"
          row-key="id"
          flat
          bordered
          :loading="loading"
          no-data-label="No hay planillas registradas"
          rows-per-page-label="Registros por página"
          :rows-per-page-options="[6, 10, 25]"
          pagination.sync="pagination"
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <span class="text-weight-bold">{{ props.row.id }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-mes="props">
            <q-td :props="props">
              {{ props.row.mes }}
            </q-td>
          </template>

          <template v-slot:body-cell-anio="props">
            <q-td :props="props">
              {{ props.row.anio }}
            </q-td>
          </template>

          <template v-slot:body-cell-fechaCierre="props">
            <q-td :props="props">
              <div class="flex items-center q-gutter-xs">
                <q-icon name="event" size="xs" />
                {{ new Date(props.row.fechaGeneracion).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge color="positive" text-color="white">
                <q-icon name="check_circle" size="xs" class="q-mr-xs" />
                Pagada
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <div class="flex justify-center q-gutter-xs">
                <q-btn 
                  unelevated
                  color="primary" 
                  label="Ver Detalle" 
                  icon="visibility"
                  size="sm"
                  @click="verPlanilla(props.row.id)"
                />
                <q-btn 
                  unelevated
                  color="info" 
                  label="Descargar" 
                  icon="download"
                  size="sm"
                  @click="descargarPDF(props.row.id)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <div v-if="planillaSeleccionada" class="only-print report-wrapper">
      <div class="report-header">
        <h1>REPORTE MENSUAL DE PLANILLA (COPIA)</h1>
        <p>Sistema de Recursos Humanos - El Salvador</p>
      </div>

      <div class="report-info">
        <div><strong>Mes:</strong> {{ planillaSeleccionada.mes }} {{ planillaSeleccionada.anio }}</div>
        <div><strong>Generada el:</strong> {{ new Date(planillaSeleccionada.fechaGeneracion).toLocaleString() }}</div>
        <div><strong>ID Registro:</strong> #{{ planillaSeleccionada.id }}</div>
      </div>

      <table class="report-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th class="text-right">S. Base</th>
            <th class="text-right">ISSS</th>
            <th class="text-right">AFP</th>
            <th class="text-right">Renta</th>
            <th class="text-right">Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="det in planillaSeleccionada.detalles" :key="det.id">
            <td>{{ det.empleadoNombre }}</td>
            <td class="text-right">{{ formatDinero(det.salarioContratado) }}</td>
            <td class="text-right">{{ formatDinero(det.isss) }}</td>
            <td class="text-right">{{ formatDinero(det.afp) }}</td>
            <td class="text-right">{{ formatDinero(det.renta) }}</td>
            <td class="text-right text-bold">{{ formatDinero(det.salarioLiquido) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="report-footer">
        <p>REIMPRESIÓN DE DOCUMENTO HISTÓRICO</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { generarPlanillaPDF } from 'src/utils/pdfGenerator'

const router = useRouter()

const historial = ref([])
const loading = ref(false)
const filtroAnio = ref('Todos los años')
const filtroEstado = ref('Todos los estados')
const busqueda = ref('')

const columnas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'mes', label: 'Mes', field: 'mes', align: 'left', sortable: true },
  { name: 'anio', label: 'Año', field: 'anio', align: 'left', sortable: true },
  { name: 'fechaCierre', label: 'Fecha de Cierre', field: 'fechaGeneracion', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

const formatDinero = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

const aniosDisponibles = computed(() => {
  return [...new Set(historial.value.map(p => p.anio))].sort((a, b) => b - a)
})

const totalPlanillas = computed(() => historial.value.length)

const planillasEsteAnio = computed(() => {
  const anioActual = new Date().getFullYear()
  return historial.value.filter(p => p.anio === anioActual).length
})

const historialFiltrado = computed(() => {
  return historial.value.filter(planilla => {
    const coincideAnio = filtroAnio.value === 'Todos los años' || planilla.anio === parseInt(filtroAnio.value)
    const coincideEstado = filtroEstado.value === 'Todos los estados' || true // Todos están pagados por ahora
    const coincideBusqueda = !busqueda.value || 
      planilla.mes.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      planilla.anio.toString().includes(busqueda.value) ||
      planilla.id.toString().includes(busqueda.value)
    return coincideAnio && coincideEstado && coincideBusqueda
  })
})

const limpiarFiltros = () => {
  filtroAnio.value = 'Todos los años'
  filtroEstado.value = 'Todos los estados'
  busqueda.value = ''
}

const cargarHistorial = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/planillas/historial')
    const data = await res.json()
    historial.value = data.map(p => ({
      ...p,
      totalPagado: p.detalles ? p.detalles.reduce((sum, d) => sum + (d.salarioLiquido || 0), 0) : 0,
      cantidadEmpleados: p.detalles ? p.detalles.length : 0
    }))
  } catch (error) {
    console.error('Error al cargar historial:', error)
  } finally { loading.value = false }
}

const planillaSeleccionada = ref(null)

const verPlanilla = (id) => {
  router.push({
    name: 'detalle-planilla',
    params: { id }
  })
}

const descargarPDF = (id) => {
  const planilla = historial.value.find(p => p.id === id)
  if (planilla) {
    generarPlanillaPDF(planilla, 'download')
  } else {
    console.error('Planilla no encontrada:', id)
  }
}

onMounted(cargarHistorial)
</script>

<style lang="scss">
/* Tarjetas de Estadísticas */
.stat-card {
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.stat-card-blue {
  border-left: 4px solid #4A90E2;
}

.stat-card-green {
  border-left: 4px solid #10B981;
}

.stat-card-orange {
  border-left: 4px solid #F59E0B;
}

.stat-card-purple {
  border-left: 4px solid #8B5CF6;
}

.text-blue { color: #4A90E2; }
.text-green { color: #10B981; }
.text-orange { color: #F59E0B; }
.text-purple { color: #8B5CF6; }
.text-grey-7 { color: #8B8B8B; }
.text-grey-6 { color: #A6A6A6; }

/* PANTALLA */
.only-print { display: none; }


/* IMPRESIÓN */
@media print {
  @page {
    size: letter landscape;
    margin: 15mm; /* Aumentamos el margen global */
  }

  html, body, .q-layout, .q-page-container, .q-page {
    min-height: auto !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
  }

  .no-print { display: none !important; }
  .only-print { display: block !important; }

  /* Contenedor principal con padding superior para evitar que el header del navegador lo tape */
  .report-wrapper {
    padding-top: 30px;
    font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  }

  .report-header {
    text-align: center;
    border-bottom: 2px solid #1976D2;
    margin-bottom: 30px;
    padding-bottom: 10px;
    h1 { color: #1976D2; margin: 0; font-size: 22pt; font-weight: bold; }
    p { margin: 5px 0; color: #555; font-size: 12pt; }
  }

  .report-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    font-size: 11pt;
    font-weight: 500;
  }

  .report-table {
    width: 100%;
    border-collapse: collapse;
    th {
      background-color: #1976D2 !important;
      color: white !important;
      -webkit-print-color-adjust: exact;
      padding: 12px 8px;
      text-align: left;
      font-size: 10pt;
      text-transform: uppercase;
    }
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #eee;
      font-size: 10pt;
    }
    .total-row {
      background-color: #f9f9f9 !important;
      font-weight: bold;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
    }
  }

  .report-footer {
    margin-top: 60px;
    text-align: center;
    .signature-box { margin-bottom: 30px; }
    .disclaimer { font-size: 8pt; color: #888; }
  }

  .text-right { text-align: right; }
  .text-bold { font-weight: bold; }
}

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
</style>
