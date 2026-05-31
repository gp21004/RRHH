<template>
  <q-page padding>
    <div class="no-print">
      <q-btn flat icon="arrow_back" label="Volver" color="primary" class="q-mb-md" to="/" />
      <div class="text-h4 text-primary q-mb-md text-weight-bold">Historial de Planillas</div>

      <q-table
        :rows="historial"
        :columns="columnas"
        row-key="id"
        flat bordered
        :loading="loading"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn flat round color="primary" icon="visibility" @click="verPlanilla(props.row.id)">
              <q-tooltip>Ver y Reimprimir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const historial = ref([])
const loading = ref(false)
const planillaSeleccionada = ref(null)

const columnas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'mes', label: 'Mes', field: 'mes', align: 'left' },
  { name: 'anio', label: 'Año', field: 'anio', align: 'left' },
  { name: 'fecha', label: 'Fecha de Cierre', field: 'fechaGeneracion', format: val => new Date(val).toLocaleDateString() },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

const formatDinero = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

const cargarHistorial = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/planillas/historial')
    historial.value = await res.json()
  } finally { loading.value = false }
}

const verPlanilla = (id) => {
  router.push({
    name: 'detalle-planilla',
    params: { id }
  })
}

onMounted(cargarHistorial)
</script>

<style lang="scss">
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
</style>
