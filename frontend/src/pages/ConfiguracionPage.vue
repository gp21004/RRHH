<template>
  <q-page class="config-page">
    <div class="page-header">
      <h1 class="page-title">Configuración</h1>
      <p class="page-subtitle">Administra tu cuenta y preferencias del sistema</p>
    </div>

    <div class="config-content">
      <!-- Cambiar Contraseña -->
      <div class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon config-card-icon--security">
            <q-icon name="lock" size="24px" />
          </div>
          <div>
            <h3>Cambiar Contraseña</h3>
            <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
          </div>
        </div>

        <q-form @submit.prevent="handleChangePassword" class="config-form">
          <div class="config-field">
            <label class="config-label">Contraseña Actual</label>
            <q-input
              v-model="passwordForm.actual"
              :type="showActual ? 'text' : 'password'"
              outlined
              dense
              dark
              placeholder="Ingrese su contraseña actual"
              :rules="[val => !!val || 'La contraseña actual es requerida']"
              lazy-rules
              class="config-input"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" color="grey-5" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showActual ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="showActual = !showActual"
                />
              </template>
            </q-input>
          </div>

          <div class="config-field">
            <label class="config-label">Nueva Contraseña</label>
            <q-input
              v-model="passwordForm.nueva"
              :type="showNueva ? 'text' : 'password'"
              outlined
              dense
              dark
              placeholder="Mínimo 6 caracteres"
              :rules="[
                val => !!val || 'La nueva contraseña es requerida',
                val => val.length >= 6 || 'Mínimo 6 caracteres'
              ]"
              lazy-rules
              class="config-input"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" color="grey-5" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showNueva ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="showNueva = !showNueva"
                />
              </template>
            </q-input>
          </div>

          <div class="config-field">
            <label class="config-label">Confirmar Contraseña</label>
            <q-input
              v-model="passwordForm.confirmar"
              :type="showConfirmar ? 'text' : 'password'"
              outlined
              dense
              dark
              placeholder="Repita la nueva contraseña"
              :rules="[
                val => !!val || 'Confirme la contraseña',
                val => val === passwordForm.nueva || 'Las contraseñas no coinciden'
              ]"
              lazy-rules
              class="config-input"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" color="grey-5" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmar ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  color="grey-5"
                  @click="showConfirmar = !showConfirmar"
                />
              </template>
            </q-input>
          </div>

          <q-btn
            type="submit"
            label="Actualizar Contraseña"
            color="primary"
            no-caps
            unelevated
            icon="save"
            :loading="changingPassword"
            class="config-btn"
          />
        </q-form>
      </div>

      <!-- Información del Sistema -->
      <div class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon config-card-icon--info">
            <q-icon name="info" size="24px" />
          </div>
          <div>
            <h3>Información del Sistema</h3>
            <p>Detalles sobre la versión del sistema</p>
          </div>
        </div>

        <div class="config-system-info">
          <div class="config-info-row">
            <span class="config-info-label">Aplicación</span>
            <span class="config-info-value">GestionPro RRHH</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Versión</span>
            <span class="config-info-value">1.0.0</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Framework</span>
            <span class="config-info-value">Quasar + Vue 3</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Backend</span>
            <span class="config-info-value">Express + Prisma</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Base de Datos</span>
            <span class="config-info-value">PostgreSQL (Supabase)</span>
          </div>
        </div>
      </div>

      <!-- Sesión Activa -->
      <div class="config-card">
        <div class="config-card-header">
          <div class="config-card-icon config-card-icon--session">
            <q-icon name="devices" size="24px" />
          </div>
          <div>
            <h3>Sesión Activa</h3>
            <p>Información de tu sesión actual</p>
          </div>
        </div>

        <div class="config-system-info">
          <div class="config-info-row">
            <span class="config-info-label">Usuario</span>
            <span class="config-info-value">{{ state.user?.username }}</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Rol</span>
            <span class="config-info-value config-info-value--role">{{ rolLabel }}</span>
          </div>
          <div class="config-info-row">
            <span class="config-info-label">Estado</span>
            <span class="config-info-value">
              <q-icon name="circle" color="green" size="10px" />
              Activo
            </span>
          </div>
        </div>

        <q-btn
          label="Cerrar Sesión"
          color="red-8"
          no-caps
          unelevated
          outline
          icon="logout"
          @click="handleLogout"
          class="config-btn config-btn--logout"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/stores/auth'

const $q = useQuasar()
const router = useRouter()
const { state, changePassword, logout } = useAuth()

const changingPassword = ref(false)
const showActual = ref(false)
const showNueva = ref(false)
const showConfirmar = ref(false)

const passwordForm = reactive({
  actual: '',
  nueva: '',
  confirmar: ''
})

const rolLabel = computed(() => {
  const roles = { admin: 'Administrador', supervisor: 'Supervisor', empleado: 'Empleado' }
  return roles[state.user?.rol] || state.user?.rol
})

async function handleChangePassword() {
  if (passwordForm.nueva !== passwordForm.confirmar) {
    $q.notify({ type: 'negative', message: 'Las contraseñas no coinciden', icon: 'error' })
    return
  }

  changingPassword.value = true
  try {
    await changePassword(passwordForm.actual, passwordForm.nueva)
    $q.notify({ type: 'positive', message: 'Contraseña actualizada correctamente', icon: 'check_circle' })
    passwordForm.actual = ''
    passwordForm.nueva = ''
    passwordForm.confirmar = ''
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message, icon: 'error' })
  } finally {
    changingPassword.value = false
  }
}

function handleLogout() {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro que deseas cerrar sesión?',
    cancel: { label: 'Cancelar', flat: true, color: 'grey' },
    ok: { label: 'Cerrar Sesión', color: 'red', unelevated: true },
    persistent: true,
    dark: true
  }).onOk(() => {
    logout()
    router.push('/login')
  })
}
</script>

<style scoped>
.config-page {
  padding: 24px;
  max-width: 900px;
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

.config-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-card {
  background: rgba(44, 49, 60, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 32px;
}

.config-card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
}

.config-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.config-card-icon--security {
  background: rgba(74, 144, 226, 0.15);
  color: #4a90e2;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.config-card-icon--info {
  background: rgba(108, 92, 231, 0.15);
  color: #a29bfe;
  border: 1px solid rgba(108, 92, 231, 0.2);
}

.config-card-icon--session {
  background: rgba(0, 206, 201, 0.15);
  color: #00cec9;
  border: 1px solid rgba(0, 206, 201, 0.2);
}

.config-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 4px;
}

.config-card-header p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-input :deep(.q-field__control) {
  background: rgba(15, 23, 42, 0.5) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.config-input :deep(.q-field--focused .q-field__control) {
  border-color: #4a90e2 !important;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15) !important;
}

.config-input :deep(.q-field__native) {
  color: #e2e8f0 !important;
}

.config-input :deep(.q-field__native::placeholder) {
  color: #64748b !important;
}

.config-btn {
  height: 44px;
  border-radius: 12px !important;
  font-weight: 600;
  font-size: 14px;
  margin-top: 8px;
  align-self: flex-start;
  padding: 0 24px;
}

.config-btn:not(.config-btn--logout) {
  background: linear-gradient(135deg, #4a90e2, #357abd) !important;
}

.config-btn--logout {
  margin-top: 20px;
  width: 100%;
}

.config-system-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.config-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.config-info-row:last-child {
  border-bottom: none;
}

.config-info-label {
  font-size: 14px;
  color: #94a3b8;
}

.config-info-value {
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.config-info-value--role {
  color: #4a90e2;
  font-weight: 600;
}
</style>
