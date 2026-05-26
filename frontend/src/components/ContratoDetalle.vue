<template>
  <!-- LOADER MIENTRAS CARGA -->
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando detalles del contrato...
      </div>
    </div>
  </div>

  <!-- Contenido -->
  <q-page padding v-else>

    <!-- Botón volver -->
    <div class="q-mb-md">
      <q-btn
        flat
        icon="arrow_back"
        label="Volver"
        color="primary"
        @click="$router.back()"
      />
    </div>

    <!-- Header -->
    <q-card flat bordered class="detalle-card q-mb-lg header-card">
      <q-card-section>
        <div class="row items-center q-col-gutter-lg">
          
          <!-- Avatar -->
          <div class="col-auto">
            <q-avatar
              size="100px"
              text-color="white"
              font-size="48px"
              :style="{ backgroundColor: getAvatarColor(contrato.empleadoId) }"
              class="avatar-shadow"
            >
              {{ getInitials(contrato.empleado?.nombres, contrato.empleado?.apellidos) }}
            </q-avatar>
          </div>

          <!-- Datos principales -->
          <div class="col">
            <div class="text-h4 text-weight-bold text-white">
              {{ contrato.empleado?.nombres }} {{ contrato.empleado?.apellidos }}
            </div>

            <div class="text-subtitle2 text-grey-3 q-mt-xs">
              <q-icon name="work" size="xs" class="q-mr-xs" />
              {{ contrato.cargo || 'Sin cargo asignado' }}
            </div>

            <div class="q-mt-md">
              <q-chip
                :color="getColorEstado(contrato.estado)"
                text-color="white"
                icon="check_circle"
              >
                {{ contrato.estado }}
              </q-chip>
            </div>
          </div>

          <!-- Botones acción -->
          <div class="col-auto">
            <div class="column q-gutter-sm">
              <q-btn
                color="primary"
                icon="edit"
                label="Editar"
                size="md"
                @click="editarContrato"
                unelevated
              />
              <q-btn
                color="warning"
                icon="swap_vert"
                label="Cambiar Estado"
                size="md"
                @click="mostrarDialogoEstado = true"
                unelevated
              />
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Información -->
    <div class="row q-col-gutter-lg">

      <!-- Información del contrato -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="section-header q-mb-md">
              <q-icon name="description" size="md" class="text-primary q-mr-md" />
              <span class="text-h6 text-weight-bold">Información del Contrato</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="assignment" size="sm" class="text-primary q-mr-sm" />
                <span class="label">Tipo de Contrato:</span>
              </div>
              <span class="info-value">{{ contrato.tipoContrato || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="event_available" size="sm" class="text-primary q-mr-sm" />
                <span class="label">Fecha de Inicio:</span>
              </div>
              <span class="info-value">{{ formatearFecha(contrato.fechaInicio) }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="event_busy" size="sm" class="text-primary q-mr-sm" />
                <span class="label">Fecha de Fin:</span>
              </div>
              <span class="info-value">{{ contrato.fechaFin ? formatearFecha(contrato.fechaFin) : 'Indefinido' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="verified_user" size="sm" class="text-primary q-mr-sm" />
                <span class="label">Estado:</span>
              </div>
              <span class="info-value">{{ contrato.estado }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Información laboral -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="section-header q-mb-md">
              <q-icon name="domain" size="md" class="text-warning q-mr-md" />
              <span class="text-h6 text-weight-bold">Información Laboral</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="apartment" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Departamento:</span>
              </div>
              <span class="info-value">{{ contrato.empleado?.departamento?.nombre || 'Sin departamento' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="attach_money" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Salario Contratado:</span>
              </div>
              <span class="info-value">${{ formatSalario(contrato.salarioContratado) }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="schedule" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Jornada Semanal:</span>
              </div>
              <span class="info-value">{{ contrato.jornada || 'No registrada' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="school" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Período de Prueba:</span>
              </div>
              <span class="info-value">{{ contrato.periodoPrueba || 'Sin período de prueba' }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Horario y días laborales -->
      <div class="col-12">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="section-header q-mb-md">
              <q-icon name="schedule" size="md" class="text-secondary q-mr-md" />
              <span class="text-h6 text-weight-bold">Horario y Días Laborales</span>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="schedule" size="sm" class="text-secondary q-mr-sm" />
                    <span class="label">Horario:</span>
                  </div>
                  <span class="info-value">{{ contrato.horario || 'No registrado' }}</span>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="calendar_month" size="sm" class="text-secondary q-mr-sm" />
                    <span class="label">Días Laborales:</span>
                  </div>
                  <span class="info-value">{{ contrato.diasLaborales || 'No registrados' }}</span>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cláusulas -->
      <div class="col-12" v-if="contrato.clausulas">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="section-header q-mb-md">
              <q-icon name="article" size="md" class="text-info q-mr-md" />
              <span class="text-h6 text-weight-bold">Cláusulas</span>
            </div>
            <div class="clauses-text" style="white-space: pre-wrap;">
              {{ contrato.clausulas }}
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

  </q-page>

  <!-- Diálogo cambiar estado -->
    <q-dialog v-model="mostrarDialogoEstado">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Cambiar Estado del Contrato</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Selecciona el nuevo estado:</div>
          <div class="q-gutter-md">
            <q-btn
              v-for="est in estadosDisponibles"
              :key="est"
              outline
              :label="est"
              class="full-width"
              @click="cambiarEstado(est)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()


const cargando = ref(false)
const contrato = ref({})
const mostrarDialogoEstado = ref(false)

const estadosDisponibles = ['Activo', 'Finalizado', 'Despedido', 'Renuncia', 'Suspendido']

const cargarContrato = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/contratos/${route.params.id}`
    )

    const data = await res.json()
    contrato.value = data
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar el contrato',
      position: 'top'
    })
  }
}

const getInitials = (nombres, apellidos) => {
  const n = nombres ? nombres.charAt(0).toUpperCase() : ''
  const a = apellidos ? apellidos.charAt(0).toUpperCase() : ''
  return (n + a) || '?'
}

const getAvatarColor = (id) => {
  const colors = [
    '#2563eb',
    '#16a34a',
    '#dc2626',
    '#ea580c',
    '#9333ea',
    '#0891b2'
  ]
  return colors[Math.abs(id || 0) % colors.length]
}

const getColorEstado = (estado) => {
  const colores = {
    'Activo': 'positive',
    'Finalizado': 'info',
    'Despedido': 'negative',
    'Renuncia': 'warning',
    'Suspendido': 'orange',
    'Pendiente': 'blue',
    'Cancelado': 'grey'
  }
  return colores[estado] || 'grey'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES')
}

const formatSalario = (valor) => {
  if (!valor) return '0.00'
  return parseFloat(valor).toFixed(2)
}

const editarContrato = () => {

  // Guardar contrato temporalmente
  sessionStorage.setItem(
    'contratoEditar',
    JSON.stringify(contrato.value)
  )

  // Ir a pantalla de contratos
  router.push('/contratos')
}

const cambiarEstado = async (nuevoEstado) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/contratos/${contrato.value.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      }
    )

    if (res.ok) {
      $q.notify({
        type: 'positive',
        message: `Estado actualizado a ${nuevoEstado}`,
        position: 'top'
      })
      mostrarDialogoEstado.value = false
      await cargarContrato()
    } else {
      $q.notify({
        type: 'negative',
        message: 'Error al actualizar el estado',
        position: 'top'
      })
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el estado',
      position: 'top'
    })
  }
}

onMounted(async () => {
  cargando.value = true
  await cargarContrato()
  cargando.value = false
})
</script>

<style scoped>
.detalle-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b 0%, #1a365d 100%);
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.header-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.avatar-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.info-card {
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.6);
  height: 100%;
  border: 1px solid rgba(100, 150, 255, 0.15);
  transition: all 0.3s ease;
}

.info-card:hover {
  background: rgba(30, 41, 59, 0.8);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(100, 150, 255, 0.2);
}

.section-header span {
  color: #ffffff;
  font-weight: 700;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(100, 150, 255, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.label {
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.info-value {
  color: #ffffff;
  font-weight: 500;
  text-align: right;
  flex: 0 1 auto;
  margin-left: 16px;
  word-break: break-word;
}

.clauses-text {
  color: #ffffff;
  line-height: 1.6;
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
</style>
