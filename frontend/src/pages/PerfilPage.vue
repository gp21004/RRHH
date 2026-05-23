<template>
  <q-page class="perfil-page">
    <div class="page-header">
      <h1 class="page-title">Mi Perfil</h1>
      <p class="page-subtitle">Gestiona tu información personal</p>
    </div>

    <div class="perfil-content">
      <!-- Card de Avatar y Info Principal -->
      <div class="perfil-card perfil-card--main">
        <div class="perfil-avatar-section">
          <div class="perfil-avatar">
            <span class="perfil-avatar-text">{{ userInitials }}</span>
          </div>
          <div class="perfil-badge" :class="`perfil-badge--${state.user?.rol}`">
            {{ rolLabel }}
          </div>
        </div>
        <div class="perfil-info-main">
          <h2 class="perfil-name">{{ state.user?.nombreCompleto }}</h2>
          <p class="perfil-username">@{{ state.user?.username }}</p>
          <p class="perfil-email">
            <q-icon name="email" size="16px" />
            {{ state.user?.correo || 'Sin correo' }}
          </p>
          <p class="perfil-date">
            <q-icon name="calendar_today" size="16px" />
            Miembro desde {{ formatDate(state.user?.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Card de Editar Perfil -->
      <div class="perfil-card perfil-card--edit">
        <div class="perfil-card-header">
          <q-icon name="edit" size="22px" color="primary" />
          <h3>Editar Información</h3>
        </div>

        <q-form @submit.prevent="handleUpdateProfile" class="perfil-form">
          <div class="perfil-field">
            <label class="perfil-label">Nombre Completo</label>
            <q-input
              v-model="editForm.nombreCompleto"
              outlined
              dense
              dark
              :rules="[val => !!val || 'El nombre es requerido']"
              class="perfil-input"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="grey-5" />
              </template>
            </q-input>
          </div>

          <div class="perfil-field">
            <label class="perfil-label">Correo Electrónico</label>
            <q-input
              v-model="editForm.correo"
              outlined
              dense
              dark
              type="email"
              class="perfil-input"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="grey-5" />
              </template>
            </q-input>
          </div>

          <q-btn
            type="submit"
            label="Guardar Cambios"
            color="primary"
            no-caps
            unelevated
            :loading="savingProfile"
            class="perfil-btn"
          />
        </q-form>
      </div>

      <!-- Card de Información del Rol -->
      <div class="perfil-card perfil-card--role">
        <div class="perfil-card-header">
          <q-icon name="shield" size="22px" color="amber" />
          <h3>Permisos del Rol</h3>
        </div>

        <div class="perfil-permissions">
          <div v-for="perm in rolePermissions" :key="perm.label" class="perfil-perm-item">
            <q-icon
              :name="perm.allowed ? 'check_circle' : 'cancel'"
              :color="perm.allowed ? 'green' : 'red-4'"
              size="20px"
            />
            <span>{{ perm.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuth } from 'src/stores/auth'

const $q = useQuasar()
const { state, userInitials, fetchProfile, updateProfile } = useAuth()

const savingProfile = ref(false)

const editForm = reactive({
  nombreCompleto: '',
  correo: ''
})

const rolLabel = computed(() => {
  const roles = { admin: 'Administrador', supervisor: 'Supervisor', empleado: 'Empleado' }
  return roles[state.user?.rol] || state.user?.rol
})

const rolePermissions = computed(() => {
  const rol = state.user?.rol
  return [
    { label: 'Ver Dashboard', allowed: true },
    { label: 'Gestionar Empleados', allowed: rol === 'admin' || rol === 'supervisor' },
    { label: 'Generar Planillas', allowed: rol === 'admin' || rol === 'supervisor' },
    { label: 'Ver Reportes', allowed: true },
    { label: 'Gestionar Contratos', allowed: rol === 'admin' || rol === 'supervisor' },
    { label: 'Administrar Usuarios', allowed: rol === 'admin' },
    { label: 'Configuración del Sistema', allowed: rol === 'admin' }
  ]
})

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('es-SV', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

async function handleUpdateProfile() {
  savingProfile.value = true
  try {
    await updateProfile(editForm.nombreCompleto, editForm.correo)
    $q.notify({ type: 'positive', message: 'Perfil actualizado correctamente', icon: 'check_circle' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message, icon: 'error' })
  } finally {
    savingProfile.value = false
  }
}

onMounted(async () => {
  try {
    await fetchProfile()
  } catch (error) { 
    console.warn('Aviso de sesión:', error) 
  }
  editForm.nombreCompleto = state.user?.nombreCompleto || ''
  editForm.correo = state.user?.correo || ''
})
</script>

<style scoped>
.perfil-page {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.perfil-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.perfil-card {
  background: rgba(44, 49, 60, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 32px;
}

.perfil-card--main {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 32px;
}

.perfil-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.perfil-avatar {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.3);
}

.perfil-avatar-text {
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.perfil-badge {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.perfil-badge--admin {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.perfil-badge--supervisor {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.perfil-badge--empleado {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.perfil-info-main {
  flex: 1;
}

.perfil-name {
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
}

.perfil-username {
  font-size: 15px;
  color: #4a90e2;
  margin: 0 0 16px;
  font-weight: 500;
}

.perfil-email,
.perfil-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 8px;
}

.perfil-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.perfil-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.perfil-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.perfil-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.perfil-input :deep(.q-field__control) {
  background: rgba(15, 23, 42, 0.5) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.perfil-input :deep(.q-field--focused .q-field__control) {
  border-color: #4a90e2 !important;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15) !important;
}

.perfil-input :deep(.q-field__native) {
  color: #e2e8f0 !important;
}

.perfil-btn {
  height: 44px;
  border-radius: 12px !important;
  font-weight: 600;
  font-size: 14px;
  background: linear-gradient(135deg, #4a90e2, #357abd) !important;
  margin-top: 8px;
}

.perfil-permissions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.perfil-perm-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .perfil-content {
    grid-template-columns: 1fr;
  }

  .perfil-card--main {
    flex-direction: column;
    text-align: center;
  }
}
</style>
