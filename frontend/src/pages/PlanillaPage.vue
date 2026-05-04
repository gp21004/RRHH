<template>
  <q-page padding class="bg-grey-2">
    <q-btn flat icon="arrow_back" label="Volver al Inicio" color="primary" class="q-mb-md" to="/" />

    <div class="text-h4 text-primary q-mb-md">Generación y Cierre de Planillas</div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-3">
            <q-select outlined v-model="mesPlanilla" :options="meses" label="Mes a calcular" />
          </div>
          <div class="col-12 col-md-3">
            <q-input outlined v-model.number="anioPlanilla" type="number" label="Año" />
          </div>
          <div class="col-12 col-md-3">
            <q-btn label="1. Calcular" color="primary" size="lg" icon="calculate" class="full-width" @click="generarPlanilla" />
          </div>
          <div class="col-12 col-md-3" v-if="detallePlanilla.length > 0">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-btn label="Guardar" color="positive" icon="save" class="full-width" @click="guardarEnHistorial" />
              </div>
              <div class="col-6">
                <q-btn label="PDF" color="red" icon="picture_as_pdf" class="full-width" @click="exportarPDF" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div id="zona-impresion">
      <div v-if="imprimiendo" class="text-h4 text-center q-mb-md">Planilla Mensual: {{ mesPlanilla }} {{ anioPlanilla }}</div>
      
      <q-table
        title="Detalle de Planilla (ISSS, AFP y Renta)"
        :rows="detallePlanilla"
        :columns="columnasPlanilla"
        row-key="empleadoNombre"
        flat bordered
        :pagination="{ rowsPerPage: 0 }"
        hide-pagination
        no-data-label="Genera una planilla para ver los cálculos"
      >
        <template v-slot:body-cell-salarioLiquido="props">
          <q-td :props="props" class="text-bold text-positive">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const mesPlanilla = ref('Mayo')
const anioPlanilla = ref(new Date().getFullYear())
const detallePlanilla = ref([])
const imprimiendo = ref(false)

const columnasPlanilla = [
  { name: 'empleado', label: 'Empleado', field: 'empleadoNombre', align: 'left' },
  { name: 'salarioBase', label: 'S. Base', field: 'salarioBase', align: 'right', format: val => `$${val}` },
  { name: 'isss', label: 'ISSS (3%)', field: 'isss', align: 'right', format: val => `$${val}` },
  { name: 'afp', label: 'AFP (7.25%)', field: 'afp', align: 'right', format: val => `$${val}` },
  { name: 'renta', label: 'Renta (ISR)', field: 'renta', align: 'right', format: val => `$${val}` },
  { name: 'salarioLiquido', label: 'Líquido a Pagar', field: 'salarioLiquido', align: 'right', format: val => `$${val}` }
]

const generarPlanilla = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/planillas/generar')
    if (respuesta.ok) {
      detallePlanilla.value = await respuesta.json()
      $q.notify({ type: 'positive', message: '¡Planilla calculada!', position: 'top' })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error de conexión' })
  }
}

// NUEVA FUNCIÓN: Guardar en la base de datos
const guardarEnHistorial = async () => {
  try {
    const datosEnvio = {
      mes: mesPlanilla.value,
      anio: anioPlanilla.value,
      detalles: detallePlanilla.value // Mandamos todos los empleados de un solo golpe
    }

    const respuesta = await fetch('http://localhost:3000/api/planillas/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosEnvio)
    })
    
    if (respuesta.ok) {
      $q.notify({ type: 'positive', message: '✅ Planilla guardada en el historial permanentemente.', position: 'top', timeout: 3000 })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al guardar en el historial' })
  }
}

// NUEVA FUNCIÓN: Exportar a PDF (Impresión nativa)
const exportarPDF = () => {
  imprimiendo.value = true;
  setTimeout(() => {
    window.print(); // Llama a la ventana de impresión/Guardar como PDF del navegador
    imprimiendo.value = false;
  }, 500);
}
</script>

<style>
/* Estilos para asegurar que la exportación a PDF se vea limpia */
@media print {
  body * {
    visibility: hidden;
  }
  #zona-impresion, #zona-impresion * {
    visibility: visible;
  }
  #zona-impresion {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>