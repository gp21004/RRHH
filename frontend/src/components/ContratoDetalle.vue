<template>
  <q-page padding>
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
    <q-card flat bordered class="detalle-card q-mb-lg">
      <q-card-section>
        <div class="row items-center q-col-gutter-lg">
          
          <!-- Avatar -->
          <div class="col-auto">
            <q-avatar
              size="90px"
              text-color="white"
              :style="{ backgroundColor: getAvatarColor(contrato.empleadoId) }"
            >
              {{ getInitials(contrato.empleado?.nombres, contrato.empleado?.apellidos) }}
            </q-avatar>
          </div>

          <!-- Datos principales -->
          <div class="col">
            <div class="text-h5 text-weight-bold">
              {{ contrato.empleado?.nombres }} {{ contrato.empleado?.apellidos }}
            </div>

            <div class="text-subtitle1 text-grey-7">
              {{ contrato.cargo || 'Sin cargo asignado' }}
            </div>

            <div class="q-mt-sm">
              <q-chip
                :color="getColorEstado(contrato.estado)"
                text-color="white"
              >
                {{ contrato.estado }}
              </q-chip>
            </div>
          </div>

          <!-- Botones acción -->
          <div class="col-auto">
            <div class="q-gutter-sm">
              <q-btn
                color="primary"
                icon="edit"
                label="Editar"
                @click="editarContrato"
              />
              <q-btn
                color="negative"
                icon="person_off"
                label="Cambiar Estado"
                @click="mostrarDialogoEstado = true"
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
            <div class="text-h6 text-weight-bold q-mb-md">
              Información del Contrato
            </div>

            <div class="info-item">
              <span class="label">Tipo de Contrato:</span>
              <span>{{ contrato.tipoContrato || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Fecha de Inicio:</span>
              <span>{{ formatearFecha(contrato.fechaInicio) }}</span>
            </div>

            <div class="info-item">
              <span class="label">Fecha de Fin:</span>
              <span>{{ contrato.fechaFin ? formatearFecha(contrato.fechaFin) : 'Indefinido' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Estado:</span>
              <span>{{ contrato.estado }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Información laboral -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              Información Laboral
            </div>

            <div class="info-item">
              <span class="label">Departamento:</span>
              <span>{{ contrato.empleado?.departamento?.nombre || 'Sin departamento' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Salario Contratado:</span>
              <span>${{ formatSalario(contrato.salarioContratado) }}</span>
            </div>

            <div class="info-item">
              <span class="label">Jornada Semanal:</span>
              <span>{{ contrato.jornada || 'No registrada' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Período de Prueba:</span>
              <span>{{ contrato.periodoPrueba || 'Sin período de prueba' }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Horario y días laborales -->
      <div class="col-12">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              Horario y Días Laborales
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <div class="info-item">
                  <span class="label">Horario:</span>
                  <span>{{ contrato.horario || 'No registrado' }}</span>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="info-item">
                  <span class="label">Días Laborales:</span>
                  <span>{{ contrato.diasLaborales || 'No registrados' }}</span>
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
            <div class="text-h6 text-weight-bold q-mb-md">
              Cláusulas
            </div>
            <div class="text-body2" style="white-space: pre-wrap;">
              {{ contrato.clausulas }}
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

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
  $q.notify({
    type: 'info',
    message: 'Función de edición aún no implementada',
    position: 'top'
  })
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

onMounted(() => {
  cargarContrato()
})
</script>

<style scoped>
.detalle-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 600;
  color: #374151;
}

.info-item span {
  color: #6b7280;
}
</style>
