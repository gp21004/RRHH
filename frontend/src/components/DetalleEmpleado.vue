<!-- src/pages/empleados/EmpleadoDetalle.vue -->

<template>
  <q-page padding>

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
    <template v-else>

    <!-- BOTON VOLVER -->
    <div class="q-mb-md">
      <q-btn
        flat
        icon="arrow_back"
        label="Volver"
        color="primary"
        @click="$router.back()"
      />
    </div>

    <!-- HEADER -->
    <q-card flat bordered class="detalle-card q-mb-lg header-card">

      <q-card-section>

        <div class="row items-center q-col-gutter-lg">

          <!-- AVATAR -->
          <div class="col-auto">

            <q-avatar
              size="100px"
              text-color="white"
              font-size="48px"
              :style="{ backgroundColor: getAvatarColor(empleado.id) }"
              class="avatar-shadow"
            >
              {{ getInitials(empleado.nombres, empleado.apellidos) }}
            </q-avatar>

          </div>

          <!-- DATOS PRINCIPALES -->
          <div class="col">

            <div class="text-h4 text-weight-bold text-white">
              {{ empleado.nombres }} {{ empleado.apellidos }}
            </div>

            <!-- ESTADO Y DUI -->
            <div class="q-mt-md row items-center q-gutter-md">

              <q-chip
                :color="empleado.estado ? 'positive' : 'negative'"
                text-color="white"
                icon="check_circle"
              >
                {{ empleado.estado ? 'Activo' : 'Inactivo' }}
              </q-chip>

              <div class="text-subtitle2 text-grey-3">
                <q-icon name="badge" size="xs" class="q-mr-xs" />
                DUI: {{ empleado.dui || 'No registrado' }}
              </div>

            </div>

          </div>

          <!-- BOTON EDITAR -->
          <div class="col-auto">

            <q-btn
              color="primary"
              icon="edit"
              label="Editar"
              size="lg"
              @click="editarEmpleado"
              unelevated
            />

          </div>

        </div>

      </q-card-section>

    </q-card>

    <!-- INFORMACION -->
    <div class="row q-col-gutter-lg">

      <!-- INFORMACION PERSONAL -->
      <div class="col-12 col-md-6">

        <q-card flat bordered class="info-card">

          <q-card-section>

            <div class="section-header q-mb-md">
              <q-icon name="person" size="md" class="text-primary q-mr-md" />
              <span class="text-h6 text-weight-bold">Información Personal</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="badge" size="sm" class="text-info q-mr-sm" />
                <span class="label">DUI:</span>
              </div>
              <span class="info-value">{{ empleado.dui || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="card_membership" size="sm" class="text-info q-mr-sm" />
                <span class="label">NIT:</span>
              </div>
              <span class="info-value">{{ empleado.nit || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="savings" size="sm" class="text-info q-mr-sm" />
                <span class="label">AFP:</span>
              </div>
              <span class="info-value">{{ empleado.nup_afp || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="cake" size="sm" class="text-info q-mr-sm" />
                <span class="label">Nacimiento:</span>
              </div>
              <span class="info-value">{{ formatearFecha(empleado.fechaNacimiento) }}</span>
            </div>

          </q-card-section>

        </q-card>

      </div>

      <!-- INFORMACION LABORAL -->
      <div class="col-12 col-md-6">

        <q-card flat bordered class="info-card">

          <q-card-section>

            <div class="section-header q-mb-md">
              <q-icon name="work" size="md" class="text-warning q-mr-md" />
              <span class="text-h6 text-weight-bold">Información Laboral</span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="domain" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Departamento:</span>
              </div>
              <span class="info-value">
                {{
                  empleado.departamento
                    ? empleado.departamento.nombre
                    : 'Sin departamento'
                }}
              </span>
            </div>

            <div class="info-item">
              <div class="info-label">
                <q-icon name="verified_user" size="sm" class="text-warning q-mr-sm" />
                <span class="label">Estado:</span>
              </div>
              <span class="info-value">
                {{ empleado.estado ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

          </q-card-section>

        </q-card>

      </div>

      <!-- CONTACTO -->
      <div class="col-12">

        <q-card flat bordered class="info-card">

          <q-card-section>

            <div class="section-header q-mb-md">
              <q-icon name="contact_mail" size="md" class="text-secondary q-mr-md" />
              <span class="text-h6 text-weight-bold">Información de Contacto</span>
            </div>

            <div class="row q-col-gutter-lg">

              <div class="col-12 col-md-6">

                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="phone" size="sm" class="text-secondary q-mr-sm" />
                    <span class="label">Teléfono:</span>
                  </div>
                  <span class="info-value">
                    {{ empleado.telefono || 'No registrado' }}
                  </span>
                </div>

              </div>

              <div class="col-12 col-md-6">

                <div class="info-item">
                  <div class="info-label">
                    <q-icon name="email" size="sm" class="text-secondary q-mr-sm" />
                    <span class="label">Correo:</span>
                  </div>
                  <span class="info-value">
                    {{ empleado.correo || 'No registrado' }}
                  </span>
                </div>

              </div>

            </div>

          </q-card-section>

        </q-card>

      </div>

    </div>

    </template>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

const route = useRoute()
const router = useRouter()

const cargando = ref(false)
const empleado = ref({})

// =========================
// CARGAR EMPLEADO
// =========================
const cargarEmpleado = async () => {

  try {

    const res = await fetch(
      `http://localhost:3000/api/empleados/${route.params.id}`
    )

    const data = await res.json()

    empleado.value = data

  } catch (error) {
    console.error(error)
  }
}

// =========================
// EDITAR EMPLEADO
// =========================
const editarEmpleado = () => {

  router.push({
    path: '/contratacion',
    query: {
      editar: empleado.value.id
    }
  })
}

// =========================
// FORMATEAR FECHA
// =========================
const formatearFecha = (fecha) => {

  if (!fecha) {
    return 'No registrada'
  }

  return new Date(fecha)
    .toLocaleDateString('es-SV')
}

// =========================
// INICIALES
// =========================
const getInitials = (nombres, apellidos) => {

  const n = nombres
    ? nombres.charAt(0).toUpperCase()
    : ''

  const a = apellidos
    ? apellidos.charAt(0).toUpperCase()
    : ''

  return (n + a) || '?'
}

// =========================
// COLOR AVATAR
// =========================
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

// =========================
// ON MOUNTED
// =========================
onMounted(async () => {
  cargando.value = true
  await cargarEmpleado()
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
