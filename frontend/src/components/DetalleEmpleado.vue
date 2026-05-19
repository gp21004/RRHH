<!-- src/pages/empleados/EmpleadoDetalle.vue -->

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
              :style="{ backgroundColor: getAvatarColor(empleado.id) }"
            >
              {{ getInitials(empleado.nombres, empleado.apellidos) }}
            </q-avatar>
          </div>

          <!-- Datos principales -->
          <div class="col">
            <div class="text-h5 text-weight-bold">
              {{ empleado.nombres }} {{ empleado.apellidos }}
            </div>

            <div class="text-subtitle1 text-grey-7">
              {{ empleado.cargo || 'Sin cargo asignado' }}
            </div>

            <div class="q-mt-sm">
              <q-chip
                color="positive"
                text-color="white"
                v-if="empleado.activo"
              >
                Activo
              </q-chip>

              <q-chip
                color="negative"
                text-color="white"
                v-else
              >
                Inactivo
              </q-chip>
            </div>
          </div>

          <!-- Botón editar -->
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="edit"
              label="Editar"
            />
          </div>

        </div>
      </q-card-section>
    </q-card>

    <!-- Información -->
    <div class="row q-col-gutter-lg">

      <!-- Información personal -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              Información Personal
            </div>

            <div class="info-item">
              <span class="label">DUI:</span>
              <span>{{ empleado.dui || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <span class="label">NIT:</span>
              <span>{{ empleado.nit || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <span class="label">AFP:</span>
              <span>{{ empleado.nup_afp || 'No registrado' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Fecha Nacimiento:</span>
              <span>{{ empleado.fechaNacimiento || 'No registrada' }}</span>
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
              <span>
                {{
                  empleado.departamento
                    ? empleado.departamento.nombre
                    : 'Sin departamento'
                }}
              </span>
            </div>

            <div class="info-item">
              <span class="label">Cargo:</span>
              <span>{{ empleado.cargo || 'No asignado' }}</span>
            </div>

            <div class="info-item">
              <span class="label">Salario:</span>
              <span>${{ formatSalario(empleado.salarioBase) }}</span>
            </div>

            <div class="info-item">
              <span class="label">Estado:</span>
              <span>
                {{ empleado.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Contacto -->
      <div class="col-12">
        <q-card flat bordered class="info-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              Información de Contacto
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="info-item">
                  <span class="label">Teléfono:</span>
                  <span>{{ empleado.telefono || 'No registrado' }}</span>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="info-item">
                  <span class="label">Correo:</span>
                  <span>{{ empleado.correo || 'No registrado' }}</span>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const empleado = ref({})

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

const formatSalario = (valor) => {
  if (!valor) return '0.00'

  return parseFloat(valor).toFixed(2)
}

onMounted(() => {
  cargarEmpleado()
})
</script>