<template>
  <q-page padding>
    <div class="no-print">
      <q-btn flat icon="arrow_back" label="Volver" color="primary" class="q-mb-md" to="/" />
      <div class="text-h4 text-primary q-mb-md text-weight-bold">Generación de Planillas</div>

      <q-card flat bordered class="q-mb-lg">
        <q-card-section class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-3">
            <q-select outlined v-model="mesPlanilla" :options="meses" label="Mes" />
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined v-model.number="anioPlanilla" type="number" label="Año" />
          </div>
          <div class="col-12 col-md-7">
            <div class="row justify-end q-gutter-sm">
              <q-btn label="1. Calcular" color="primary" icon="calculate" @click="generarPlanilla" />
              <q-btn v-if="detallePlanilla.length > 0" label="2. Guardar" color="positive" icon="save" @click="guardarEnHistorial" />
              <q-btn v-if="detallePlanilla.length > 0" label="3. Exportar PDF" color="red" icon="picture_as_pdf" @click="exportarPDF" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-table
        :rows="detallePlanilla"
        :columns="columnasPlanilla"
        row-key="empleadoNombre"
        flat bordered
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      />
    </div>

    <div class="only-print report-wrapper">
      <div class="report-header">
        <h1>REPORTE MENSUAL DE PLANILLA</h1>
        <p>Sistema de Recursos Humanos - El Salvador</p>
      </div>

      <div class="report-info">
        <div><strong>Mes:</strong> {{ mesPlanilla }} {{ anioPlanilla }}</div>
        <div><strong>Fecha de Emisión:</strong> {{ new Date().toLocaleDateString() }}</div>
        <div><strong>Estado:</strong> Registro Oficial</div>
      </div>

      <table class="report-table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th class="text-right">Salario Base</th>
            <th class="text-right">ISSS (3%)</th>
            <th class="text-right">AFP (7.25%)</th>
            <th class="text-right">Renta (ISR)</th>
            <th class="text-right">Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in detallePlanilla" :key="item.empleadoId">
            <td>{{ item.empleadoNombre }}</td>
            <td class="text-right">{{ formatDinero(item.salarioBase) }}</td>
            <td class="text-right">{{ formatDinero(item.isss) }}</td>
            <td class="text-right">{{ formatDinero(item.afp) }}</td>
            <td class="text-right">{{ formatDinero(item.renta) }}</td>
            <td class="text-right text-bold">{{ formatDinero(item.salarioLiquido) }}</td>
          </tr>
          <tr class="total-row">
            <td colspan="5" class="text-right">TOTAL A PAGAR EN PLANILLA:</td>
            <td class="text-right">{{ formatDinero(totalPlanilla) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="report-footer">
        <div class="signature-box">
          <p>___________________________________</p>
          <p>Firma y Sello de Contabilidad</p>
        </div>
        <p class="disclaimer">Este documento es un comprobante generado por el sistema de RRHH.</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const mesPlanilla = ref('Mayo')
const anioPlanilla = ref(new Date().getFullYear())
const detallePlanilla = ref([])

// Función para dar formato de dinero a los números ($1,200.00)
const formatDinero = (valor) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(valor)
}

const columnasPlanilla = [
  { name: 'empleado', label: 'Empleado', field: 'empleadoNombre', align: 'left' },
  { name: 'salarioBase', label: 'S. Base', field: 'salarioBase', align: 'right', format: val => formatDinero(val) },
  { name: 'isss', label: 'ISSS', field: 'isss', align: 'right', format: val => formatDinero(val) },
  { name: 'afp', label: 'AFP', field: 'afp', align: 'right', format: val => formatDinero(val) },
  { name: 'renta', label: 'Renta', field: 'renta', align: 'right', format: val => formatDinero(val) },
  { name: 'salarioLiquido', label: 'Líquido', field: 'salarioLiquido', align: 'right', format: val => formatDinero(val) }
]

const totalPlanilla = computed(() => {
  return detallePlanilla.value.reduce((acc, item) => acc + Number(item.salarioLiquido), 0)
})

const generarPlanilla = async () => {
  const res = await fetch('http://localhost:3000/api/planillas/generar')
  detallePlanilla.value = await res.json()
  $q.notify({ type: 'info', message: 'Planilla calculada' })
}

const guardarEnHistorial = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/planillas/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mes: mesPlanilla.value, anio: anioPlanilla.value, detalles: detallePlanilla.value })
    })
    if (res.ok) $q.notify({ type: 'positive', message: 'Guardado correctamente' })
  } catch (e) { console.error(e) }
}

const exportarPDF = () => {
  window.print() 
}
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