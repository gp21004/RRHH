<template>
  <q-page class="bg-grey-2 q-pa-lg">
    <!-- Header Welcome -->
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h1 class="text-h4 text-weight-bold text-grey-9 q-ma-none">¡Bienvenido de vuelta! 👋</h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm q-mb-none">Aquí tienes un resumen general de tu sistema de RRHH</p>
      </div>
      <div class="col-auto text-grey-6 text-caption" style="font-weight: 500;">
        {{ fechaActual }}
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-blue">
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ empleadosCount }}</div>
                <div class="kpi-label">Empleados Activos</div>
                <div class="kpi-change">{{ empleadosCount > 0 ? '✓ Activos' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container">
                <q-icon name="people" size="40px" color="primary" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-teal">
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ contratosCount }}</div>
                <div class="kpi-label">Contratos Activos</div>
                <div class="kpi-change">{{ contratosCount > 0 ? '✓ Vigentes' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container">
                <q-icon name="description" size="40px" color="info" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-green">
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">${{ (totalPagos / 1000).toFixed(0) }}k</div>
                <div class="kpi-label">Total en Pagos</div>
                <div class="kpi-change">{{ totalPagos > 0 ? '✓ Calculado' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container">
                <q-icon name="attach_money" size="40px" color="green" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card kpi-orange">
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between">
              <div>
                <div class="kpi-number">{{ planillasCount }}</div>
                <div class="kpi-label">Planillas Generadas</div>
                <div class="kpi-change">{{ planillasCount > 0 ? '✓ Histórico' : 'Sin datos' }}</div>
              </div>
              <div class="kpi-icon-container">
                <q-icon name="schedule" size="40px" color="orange" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Módulos Principales -->
    <div class="q-mb-lg">
      <h2 class="text-h5 text-weight-bold text-grey-9 q-mb-md">Módulos principales</h2>
      <p class="text-body2 text-grey-7 q-mb-md">Accede rápidamente a las funciones principales del sistema</p>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="module-card cursor-pointer" @click="$router.push('/contratacion')">
            <q-card-section class="text-center q-pa-lg">
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
            <q-card-section class="text-center q-pa-lg">
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
            <q-card-section class="text-center q-pa-lg">
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
            <q-card-section class="text-center q-pa-lg">
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

    <!-- Resumen Mensual y Distribución -->
    <div class="row q-col-gutter-md">
      <!-- Resumen Mensual -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <div class="flex items-center justify-between q-mb-md">
              <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none">Resumen mensual</h3>
              <q-select v-model="mesSeleccionado" :options="meses" outlined dense emit-value map-options class="col-auto" style="width: 140px" />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <div class="bg-grey-2 q-pa-md rounded-borders">
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Total pagado</div>
                  <div class="text-h5 text-weight-bold text-grey-9">$28,450.00</div>
                  <div class="text-caption text-positive q-mt-xs">↑ 12% vs abril 2025</div>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-grey-2 q-pa-md rounded-borders">
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Descuentos totales</div>
                  <div class="text-h5 text-weight-bold text-grey-9">$6,540.00</div>
                  <div class="text-caption text-positive q-mt-xs">↑ 8% vs abril 2025</div>
                </div>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-md">
              <div class="col-4">
                <div class="text-center">
                  <div class="text-caption text-grey-7 q-mb-xs">ISSS</div>
                  <div class="text-h6 text-weight-bold text-grey-9">$1,920.00</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-caption text-grey-7 q-mb-xs">AFP</div>
                  <div class="text-h6 text-weight-bold text-grey-9">$3,840.00</div>
                </div>
              </div>
              <div class="col-4">
                <div class="text-center">
                  <div class="text-caption text-grey-7 q-mb-xs">Renta</div>
                  <div class="text-h6 text-weight-bold text-grey-9">$780.00</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Distribución de Empleados -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="q-pa-md">
            <h3 class="text-h6 text-weight-bold text-grey-9 q-ma-none q-mb-md">Distribución de empleados</h3>
            <p class="text-caption text-grey-7 q-mb-md">Por departamento</p>

            <div class="flex items-center justify-center q-mb-md" style="min-height: 120px;">
              <div class="text-center">
                <div class="text-h3 text-weight-bold text-grey-9">{{ empleadosCount }}</div>
                <div class="text-caption text-grey-7">Total</div>
              </div>
            </div>

            <q-list separator>
              <q-item v-for="depto in distribucionEmpleados" :key="depto.nombre">
                <q-item-section avatar>
                  <q-icon name="circle" size="12px" :color="getColorDepto(depto.nombre)" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ depto.nombre }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-weight-bold">{{ depto.cantidad }} ({{ depto.porcentaje }}%)</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="distribucionEmpleados.length === 0">
                <q-item-section>
                  <q-item-label class="text-grey-7">Sin datos disponibles</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
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

// Función para asignar colores a departamentos
const getColorDepto = (nombreDepto) => {
  const colores = {
    'Administración': 'blue',
    'Ventas': 'green',
    'Operaciones': 'orange',
    'TI': 'purple',
    'Recursos Humanos': 'red',
    'Marketing': 'pink',
    'Finanzas': 'cyan'
  }
  return colores[nombreDepto] || 'grey'
}

onMounted(cargarDatos)
</script>

<style scoped>
.kpi-card {
  border: none;
  border-left: 4px solid #1976d2;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.kpi-card:hover {
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.kpi-blue {
  border-left-color: #2563eb;
}

.kpi-teal {
  border-left-color: #06b6d4;
}

.kpi-green {
  border-left-color: #16a34a;
}

.kpi-orange {
  border-left-color: #ea580c;
}

.kpi-number {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.kpi-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 6px;
}

.kpi-change {
  font-size: 12px;
  color: #16a34a;
  margin-top: 6px;
  font-weight: 600;
}

.kpi-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.75;
}

.module-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: white;
}

.module-card:hover {
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
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
</style>
