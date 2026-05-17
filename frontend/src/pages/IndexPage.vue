<template>
  <q-page class="bg-grey-2 q-px-lg q-py-md">
    <!-- Header Welcome -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h4 text-weight-bold text-grey-9 q-ma-none">¡Bienvenido de vuelta! 👋</h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm q-mb-none">Aquí tienes un resumen general de tu sistema de RRHH</p>
      </div>
      <div class="col-auto text-grey-6 text-caption" style="font-weight: 500;">
        {{ fechaActual }}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <div class="kpi-header kpi-header-blue"></div>
          <q-card-section class="q-pa-sm">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ empleadosCount }}</div>
                <div class="kpi-label">Empleados Activos</div>
                <div class="kpi-change">{{ empleadosCount > 0 ? '✓ Activos' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container kpi-icon-blue">
                <q-icon name="people" size="32px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <div class="kpi-header kpi-header-teal"></div>
          <q-card-section class="q-pa-sm">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ contratosCount }}</div>
                <div class="kpi-label">Contratos Activos</div>
                <div class="kpi-change">{{ contratosCount > 0 ? '✓ Vigentes' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container kpi-icon-teal">
                <q-icon name="description" size="32px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <div class="kpi-header kpi-header-green"></div>
          <q-card-section class="q-pa-sm">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">${{ (totalPagos / 1000).toFixed(0) }}k</div>
                <div class="kpi-label">Total en Pagos</div>
                <div class="kpi-change">{{ totalPagos > 0 ? '✓ Calculado' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container kpi-icon-green">
                <q-icon name="attach_money" size="32px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card">
          <div class="kpi-header kpi-header-orange"></div>
          <q-card-section class="q-pa-sm">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ planillasCount }}</div>
                <div class="kpi-label">Planillas Generadas</div>
                <div class="kpi-change">{{ planillasCount > 0 ? '✓ Histórico' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container kpi-icon-orange">
                <q-icon name="schedule" size="32px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Módulos Principales -->
    <div class="q-mb-md">
      <h2 class="text-h5 text-weight-bold text-grey-9 q-mb-sm">Módulos principales</h2>
      <p class="text-body2 text-grey-7 q-mb-md">Accede rápidamente a las funciones principales</p>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="module-card cursor-pointer" @click="$router.push('/contratacion')">
            <q-card-section class="text-center q-pa-md">
                 <q-avatar
                  size="56px"
                  style="background: #EEF4FF"
              >
              <q-icon
              name="people"
              size="32px"
              color="primary"
              />
            </q-avatar>
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none">Contratación y Personal</h3>
              <p class="text-caption text-grey-7 q-mt-md q-mb-none">Gestiona departamentos, empleados y su información personal.</p>
              <q-btn flat color="primary" label="Acceder" size="sm" icon-right="arrow_forward" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="module-card cursor-pointer" @click="$router.push('/contratos')">
            <q-card-section class="text-center q-pa-md">
              <q-avatar size="56px" style="background: #E3F2FD">
                <q-icon name="description" size="32px" color="info" />
              </q-avatar>
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none q-mt-md">Gestión de Contratos</h3>
              <p class="text-caption text-grey-7 q-mt-md q-mb-none">Crea, edita y administra los contratos de tus empleados.</p>
              <q-btn flat color="info" label="Acceder" size="sm" icon-right="arrow_forward" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="module-card cursor-pointer" @click="$router.push('/planillas')">
            <q-card-section class="text-center q-pa-md">
              <q-avatar size="56px" style="background: #E8F5E9">
                <q-icon name="request_quote" size="32px" color="positive" />
              </q-avatar>
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none q-mt-md">Generación de Planillas</h3>
              <p class="text-caption text-grey-7 q-mt-md q-mb-none">Calcula ISSS, AFP y Renta automáticamente. Genera planillas.</p>
              <q-btn flat color="positive" label="Acceder" size="sm" icon-right="arrow_forward" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="module-card cursor-pointer" @click="$router.push('/historial')">
            <q-card-section class="text-center q-pa-md">
              <q-avatar size="56px" style="background: #FFF3E0">
                <q-icon name="history" size="32px" color="warning" />
              </q-avatar>
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none q-mt-md">Historial de Planillas</h3>
              <p class="text-caption text-grey-7 q-mt-md q-mb-none">Consulta y descarga el historial de planillas generadas anteriormente.</p>
              <q-btn flat color="warning" label="Acceder" size="sm" icon-right="arrow_forward" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Sección Analítica: Gráfico + Resumen Mensual (2 columnas) -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Gráfico Distribución Empleados (Izquierda) -->
      <div class="col-12 col-lg-6">
        <q-card class="chart-card h-full">
          <q-card-section class="q-pa-md">
            <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none q-mb-md">Distribución de empleados</h3>
            
            <div class="chart-container q-mb-md">
              <ApexChart
                type="donut"
                height="280"
                :options="chartOptions"
                :series="chartSeries"
              />
            </div>

            <div class="legend-compact">
              <div v-for="depto in distribucionEmpleados" :key="depto.nombre" class="legend-item-compact">
                <div class="legend-color" :style="{ backgroundColor: getColorDepto(depto.nombre) }"></div>
                <div class="legend-text">
                  <span class="text-weight-bold">{{ depto.nombre }}</span>
                  <span class="text-grey-7"> {{ depto.cantidad }}</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resumen Mensual (Derecha) -->
      <div class="col-12 col-lg-6">
        <q-card class="chart-card h-full">
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between q-mb-md">
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none">Resumen mensual</h3>
              <q-select v-model="mesSeleccionado" :options="meses" outlined dense emit-value map-options style="width: 120px" />
            </div>

            <!-- KPIs pequeños de resumen -->
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-6">
                <div class="summary-mini">
                  <div class="summary-label-mini">Total pagado</div>
                  <div class="summary-value-mini">$28,450</div>
                </div>
              </div>
              <div class="col-6">
                <div class="summary-mini">
                  <div class="summary-label-mini">Descuentos</div>
                  <div class="summary-value-mini">$6,540</div>
                </div>
              </div>
            </div>

            <q-separator class="q-my-sm" />

            <!-- Desglose compacto -->
            <div class="q-mt-md">
              <div class="text-caption text-weight-bold text-grey-7 q-mb-sm">DESGLOSE</div>
              <div class="desglose-item">
                <span>ISSS</span>
                <span class="text-weight-bold">$1,920</span>
              </div>
              <div class="desglose-item">
                <span>AFP</span>
                <span class="text-weight-bold">$3,840</span>
              </div>
              <div class="desglose-item">
                <span>Renta</span>
                <span class="text-weight-bold">$780</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Planillas Recientes -->
    <div class="q-mt-lg">
      <q-card>
        <q-card-section class="q-pa-md">
          <div class="flex items-center justify-between q-mb-md">
            <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none">Planillas recientes</h3>
            <q-btn flat color="primary" label="Ver todas" size="sm" />
          </div>

          <q-list separator>
            <q-item v-for="planilla in planillasRecientes" :key="planilla.id">
              <q-item-section avatar>
                <q-icon name="calendar_month" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ planilla.mes }}</q-item-label>
                <q-item-label caption>Generada el {{ planilla.fecha }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <div class="text-right">
                  <div class="text-weight-bold">{{ planilla.monto }}</div>
                  <q-chip :color="planilla.status === 'Completada' ? 'positive' : 'warning'" text-color="white" size="sm">
                    {{ planilla.status }}
                  </q-chip>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const meses = [
  { label: 'Mayo 2025', value: 'mayo' },
  { label: 'Abril 2025', value: 'abril' },
  { label: 'Marzo 2025', value: 'marzo' }
]

const mesSeleccionado = ref('mayo')

// Datos que se cargarán desde la API
const empleadosCount = ref(0)
const contratosCount = ref(0)
const totalPagos = ref(0)
const planillasCount = ref(0)
const planillasRecientes = ref([])
const distribucionEmpleados = ref([])
const loading = ref(true)
const chartSeries = computed(() => {
  return distribucionEmpleados.value.map(
    depto => depto.cantidad
  )
})

const chartOptions = computed(() => ({
  labels: distribucionEmpleados.value.map(
    depto => depto.nombre
  ),

  legend: {
    position: 'bottom'
  },

  dataLabels: {
    enabled: true
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',

        labels: {
          show: true,

          total: {
            show: true,
            label: 'Total',

            formatter: () => empleadosCount.value
          }
        }
      }
    }
  },

  colors: distribucionEmpleados.value.map(
    depto => {
      const colores = {
        'Administración': '#2563EB',
        'Ventas': '#16A34A',
        'Operaciones': '#EA580C',
        'TI': '#9333EA',
        'Recursos Humanos': '#DC2626',
        'Marketing': '#DB2777',
        'Finanzas': '#0891B2'
      }

      return colores[depto.nombre] || '#9CA3AF'
    }
  )
}))

const fechaActual = computed(() => {
  const hoy = new Date()
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return hoy.toLocaleDateString('es-ES', opciones)
})

// Cargar datos desde la API
const cargarDatos = async () => {
  loading.value = true
  try {
    // Cargar empleados
    const resEmpleados = await fetch('http://localhost:3000/api/empleados')
    if (resEmpleados.ok) {
      const empleados = await resEmpleados.json()
      empleadosCount.value = empleados.length
      
      // Agrupar empleados por departamento
      const agrupado = {}
      empleados.forEach(emp => {
        const depto = emp.departamento?.nombre || 'Sin Depto'
        agrupado[depto] = (agrupado[depto] || 0) + 1
      })
      
      distribucionEmpleados.value = Object.entries(agrupado).map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
        porcentaje: Math.round((cantidad / empleados.length) * 100)
      }))
    }

    // Cargar contratos
    const resContratos = await fetch('http://localhost:3000/api/contratos')
    if (resContratos.ok) {
      const contratos = await resContratos.json()
      contratosCount.value = contratos.filter(c => c.estado === 'Activo').length
    }

    // Cargar planillas
    const resPlanillas = await fetch('http://localhost:3000/api/planillas/historial')
    if (resPlanillas.ok) {
      const planillas = await resPlanillas.json()
      planillasCount.value = planillas.length
      
      // Mostrar últimas 3 planillas
      planillasRecientes.value = planillas.slice(0, 3).map(p => ({
        id: p.id,
        mes: p.mes + ' ' + p.anio,
        fecha: new Date(p.fechaGeneracion).toLocaleDateString('es-ES'),
        monto: '$' + (p.detalles?.reduce((sum, d) => sum + d.salarioLiquido, 0) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        status: 'Completada'
      }))
      
      // Calcular total pagos de todas las planillas
      totalPagos.value = planillas.reduce((sum, p) => sum + (p.detalles?.reduce((s, d) => s + d.salarioLiquido, 0) || 0), 0)
    }
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}


const getColorDepto = (nombreDepto) => {
  const colores = {
    'Administración': '#2563EB',
    'Ventas': '#16A34A',
    'Operaciones': '#EA580C',
    'TI': '#9333EA',
    'Recursos Humanos': '#DC2626',
    'Marketing': '#DB2777',
    'Finanzas': '#0891B2'
  }
  return colores[nombreDepto] || '#9CA3AF'
}

onMounted(cargarDatos)
</script>

<style scoped>
.kpi-card {
  border: none;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.kpi-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-6px);
}

.kpi-header {
  height: 4px;
  width: 100%;
}

.kpi-header-blue {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
}

.kpi-header-teal {
  background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%);
}

.kpi-header-green {
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
}

.kpi-header-orange {
  background: linear-gradient(90deg, #ea580c 0%, #fb923c 100%);
}

.kpi-number {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.kpi-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 4px;
}

.kpi-change {
  font-size: 11px;
  color: #16a34a;
  margin-top: 4px;
  font-weight: 600;
}

.kpi-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.kpi-icon-blue {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.kpi-icon-teal {
  background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
}

.kpi-icon-green {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.kpi-icon-orange {
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
}

.module-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: white;
}

.module-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  transform: translateY(-8px);
  border-color: #d1d5db;
}

.chart-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
  height: 100%;
}

.chart-container {
  display: flex;
  justify-content: center;
}

.h-full {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.h-full .q-card__section) {
  flex: 1;
}

.legend-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.legend-item-compact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 6px;
  background-color: #f9fafb;
  font-size: 12px;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-custom {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.summary-mini {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.summary-label-mini {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-value-mini {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.desglose-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #e5e7eb;
}

.desglose-item:last-child {
  border-bottom: none;
}

.summary-box {
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.summary-primary {
  background: linear-gradient(135deg, #EEF4FF 0%, #E3F2FD 100%);
  border: 1px solid #BBDEFB;
}

.summary-secondary {
  background: linear-gradient(135deg, #F3E5F5 0%, #E8DAEF 100%);
  border: 1px solid #E1BEE7;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 6px;
}

.summary-value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.summary-change {
  font-size: 12px;
  color: #16a34a;
  margin-top: 6px;
  font-weight: 600;
}

.discount-box {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
}

.isss {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
}

.afp {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.renta {
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
}

.discount-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.rounded-borders {
  border-radius: 12px;
}

.bg-grey-2 {
  background-color: #f9fafb;
}

:deep(.q-pa-lg) {
  padding: 32px;
}

:deep(.q-mb-xl) {
  margin-bottom: 32px;
}

:deep(.text-h4) {
  font-size: 32px;
  line-height: 1.2;
}

:deep(.flex-1) {
  flex: 1;
}
</style>
