O<template>
  <!-- LOADER MIENTRAS CARGA -->
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando detalles del empleado...
      </div>
    </div>
  </div>

  <!-- Contenido -->
  <q-page padding v-else>
    <!-- Header con navegación -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none">Detalle de Planilla - Empleado</h1>
        <div class="text-subtitle2 text-grey">
          Inicio / Planillas / Detalles Empleado
        </div>
      </div>
      <q-btn
        flat
        outline
        icon="arrow_back"
        label="Volver"
        color="primary"
        @click="$router.back()"
      />
    </div>

    <!-- Tarjeta de Información del Empleado -->
    <q-card flat bordered class="q-mb-lg employee-info-card">
      <q-card-section>
        <div class="row items-center q-gutter-md">
          <!-- Avatar y datos principales -->
          <div class="col-auto">
            <q-avatar
              :src="empleado.foto || 'https://via.placeholder.com/80'"
              size="80px"
              color="primary"
              text-color="white"
            />
          </div>
          <div class="col">
            <div class="text-h6 text-weight-bold q-my-none">{{ empleado.nombre }}</div>
            <div class="text-subtitle2 text-grey q-mt-xs">{{ empleado.cargo }}</div>
          </div>
          <q-separator vertical />
          <div class="col-auto">
            <div class="info-item">
              <span class="label">Departamento</span>
              <div class="value">{{ empleado.departamento }}</div>
            </div>
          </div>
          <div class="col-auto">
            <div class="info-item">
              <span class="label">Período</span>
              <div class="value">{{ empleado.periodo }}</div>
            </div>
          </div>
          <div class="col-auto">
            <div class="info-item">
              <span class="label">Estado</span>
              <q-badge color="positive" label="Pagado" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Contenido Principal: 2 columnas en desktop -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <!-- Columna Izquierda: Ingresos y Deducciones -->
      <div class="col-12 col-md-7">
        <!-- INGRESOS -->
        <q-card flat bordered class="q-mb-lg detail-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="trending_up" color="positive" size="md" class="q-mr-sm" />
              <span class="text-h6 text-weight-bold">INGRESOS</span>
            </div>

            <div class="detail-row">
              <span class="item-label">Salario Base</span>
              <span class="item-value">{{ formatDinero(empleado.salarioBase) }}</span>
            </div>

            <q-separator class="q-my-md" />

            <div class="detail-row total-row">
              <span class="label">Total Ingresos</span>
              <span class="value text-positive">{{ formatDinero(empleado.salarioBase) }}</span>
            </div>
          </q-card-section>
        </q-card>

        <!-- DEDUCCIONES -->
        <q-card flat bordered class="q-mb-lg detail-card">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="trending_down" color="negative" size="md" class="q-mr-sm" />
              <span class="text-h6 text-weight-bold">DEDUCCIONES</span>
            </div>

            <div class="detail-row">
              <span class="item-label">ISSS (3%)</span>
              <span class="item-value">{{ formatDinero(empleado.isss) }}</span>
            </div>

            <div class="detail-row">
              <span class="item-label">AFP (7.25%)</span>
              <span class="item-value">{{ formatDinero(empleado.afp) }}</span>
            </div>

            <div class="detail-row">
              <span class="item-label">ISR (Renta)</span>
              <span class="item-value">{{ formatDinero(empleado.isr) }}</span>
            </div>

            <q-separator class="q-my-md" />

            <div class="detail-row total-row">
              <span class="label">Total Deducciones</span>
              <span class="value text-negative">{{ formatDinero(totalDeducciones) }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Columna Derecha: Resumen -->
      <div class="col-12 col-md-5">
        <!-- NETO A PAGAR - DESTACADO -->
        <q-card flat bordered class="q-mb-lg neto-card">
          <q-card-section>
            <div class="text-center q-mb-md">
              <q-icon name="wallet" color="positive" size="lg" />
            </div>
            <div class="text-subtitle1 text-grey text-center q-mb-md">NETO A PAGAR</div>
            <div class="neto-value">{{ formatDinero(empleado.netoAPagar) }}</div>
            <q-separator class="q-my-md" />
            <div class="text-caption text-grey text-center">
              Monto final a recibir por el período
            </div>
          </q-card-section>
        </q-card>

        <!-- RESUMEN RÁPIDO -->
        <q-card flat bordered class="q-mb-lg">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Resumen</div>

            <div class="summary-item">
              <span class="label">Ingresos</span>
              <span class="value positive">{{ formatDinero(empleado.salarioBase) }}</span>
            </div>

            <div class="summary-item">
              <span class="label">Deducciones</span>
              <span class="value negative">-{{ formatDinero(totalDeducciones) }}</span>
            </div>

            <q-separator class="q-my-sm" />

            <div class="summary-item total">
              <span class="label">Neto</span>
              <span class="value positive">{{ formatDinero(empleado.netoAPagar) }}</span>
            </div>
          </q-card-section>
        </q-card>

        <!-- INFORMACIÓN ADICIONAL -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Información Adicional</div>

            <div class="info-row">
              <span class="label">Cedula:</span>
              <span class="value">{{ empleado.cedula }}</span>
            </div>

            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ empleado.email }}</span>
            </div>

            <div class="info-row">
              <span class="label">Teléfono:</span>
              <span class="value">{{ empleado.telefono }}</span>
            </div>

            <div class="info-row">
              <span class="label">Fecha de Generación:</span>
              <span class="value">{{ formatFecha(empleado.fechaGeneracion) }}</span>
            </div>
          </q-card-section>
        </q-card>
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
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const cargando = ref(true)
const empleado = ref({
  id: '',
  nombre: '',
  cargo: '',
  departamento: '',
  periodo: '',
  cedula: '',
  email: '',
  telefono: '',
  foto: '',
  salarioBase: 0,
  isss: 0,
  afp: 0,
  isr: 0,
  netoAPagar: 0,
  fechaGeneracion: new Date()
})

const totalDeducciones = computed(() => {
  return empleado.value.isss + empleado.value.afp + empleado.value.isr
})

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

const cargarDetalleEmpleado = async () => {
  try {
    cargando.value = true
    const planillaId = route.params.planillaId
    const empleadoId = route.params.empleadoId
    
    const res = await fetch(
      `http://localhost:3000/api/planillas/${planillaId}/empleados/${empleadoId}`
    )
    
    if (!res.ok) {
      throw new Error('Error al cargar los detalles del empleado')
    }
    
    empleado.value = await res.json()
  } catch (error) {
    console.error('Error al cargar detalles del empleado:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los detalles del empleado'
    })
  } finally {
    cargando.value = false
  }
}

const imprimirPDF = () => {
  window.print()
}

const exportarPDF = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidad de exportar PDF próximamente disponible'
  })
}

onMounted(cargarDetalleEmpleado)
</script>

<style scoped lang="scss">
.employee-info-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-left: 4px solid var(--q-primary);
}

.info-item {
  display: flex;
  flex-direction: column;

  .label {
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .value {
    font-size: 14px;
    font-weight: bold;
    color: #e2e8f0;
  }
}

.detail-card {
  background-color: #1e293b;
  border: 1px solid #334155;

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;

    .item-label {
      color: #cbd5e1;
      font-size: 14px;
    }

    .item-value {
      font-weight: 600;
      color: #e2e8f0;
      font-size: 15px;
    }

    &.total-row {
      padding: 8px 0;

      .label {
        font-size: 14px;
        font-weight: 600;
        color: #e2e8f0;
      }

      .value {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
}

.neto-card {
  background: linear-gradient(135deg, #1a3d2a 0%, #0f2818 100%);
  border: 2px solid var(--q-positive);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  .neto-value {
    font-size: 36px;
    font-weight: bold;
    color: var(--q-positive);
    letter-spacing: 1px;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;

  .label {
    color: #cbd5e1;
    font-weight: 500;
  }

  .value {
    font-weight: 600;
    font-size: 15px;

    &.positive {
      color: var(--q-positive);
    }

    &.negative {
      color: var(--q-negative);
    }
  }

  &.total {
    border-top: 1px solid #334155;
    padding-top: 12px;
    margin-top: 8px;

    .label {
      color: #e2e8f0;
      font-weight: 600;
    }

    .value {
      font-size: 18px;
    }
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #334155;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #94a3b8;
    font-weight: 600;
  }

  .value {
    color: #e2e8f0;
    text-align: right;
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

.text-grey {
  color: #94a3b8;
}

/* Estilos para impresión */
@media print {
  @page {
    size: letter portrait;
    margin: 15mm;
  }

  .q-page {
    padding: 10mm !important;
  }

  :deep(q-btn) {
    display: none !important;
  }

  .row.items-center.justify-between {
    display: none !important;
  }

  .q-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }

  .neto-card {
    background-color: white !important;
    border-color: #000 !important;
    -webkit-print-color-adjust: exact;
    color: #000 !important;

    .neto-value {
      color: #000 !important;
    }
  }
}
</style>
