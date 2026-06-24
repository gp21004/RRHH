<template>
  <div class="login-container">
    <!-- Light Beam Effect -->
    <div class="light-beam"></div>

    <!-- Login Card -->
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="login-logo">
          <q-icon name="dashboard_customize" size="48px" color="white" />
        </div>
        <h1 class="login-title">GestionPro</h1>
        <p class="login-subtitle">Sistema de Recursos Humanos</p>
      </div>

      <!-- Form -->
      <q-form @submit.prevent="handleLogin" class="login-form">
        <div class="login-field">
          <label class="login-label">Usuario</label>
          <q-input
            v-model="username"
            dense
            borderless
            placeholder="Ingrese su usuario"
            :rules="[val => !!val || 'El usuario es requerido']"
            lazy-rules
            hide-bottom-space
            class="login-input"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" size="sm" />
            </template>
          </q-input>
        </div>

        <div class="login-field">
          <label class="login-label">Contraseña</label>
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            dense
            borderless
            placeholder="Ingrese su contraseña"
            :rules="[val => !!val || 'La contraseña es requerida']"
            lazy-rules
            hide-bottom-space
            class="login-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" size="sm" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="sm"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <div v-if="errorMsg" class="login-error">
            <q-icon name="error_outline" size="18px" />
            <span>{{ errorMsg }}</span>
          </div>
        </transition>

        <!-- Submit Button -->
        <q-btn
          type="submit"
          label="Iniciar Sesión"
          no-caps
          unelevated
          :loading="loading"
          class="login-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots size="24px" color="black" />
          </template>
        </q-btn>
      </q-form>

      <!-- Footer -->
      <div class="login-footer">
        <div class="login-footer-line"></div>
        <span class="login-footer-text">GestionPro v1.0 &copy; 2024</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from 'src/stores/auth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true

  try {
    await login(username.value, password.value)
    router.push('/')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #09090b; /* Very dark background */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Light Beam Effect */
.light-beam {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 80vw;
  height: 80vh;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  transform: rotate(-20deg);
}

/* === LOGIN CARD === */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  padding: 48px 32px 32px;
  background: rgba(30, 30, 32, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  margin: 16px;
}

/* === HEADER === */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 13px;
  color: #a1a1aa;
  margin: 0;
}

/* === FORM === */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-label {
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
  margin-left: 4px;
}

.login-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  height: 48px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

.login-input :deep(.q-field__control:before),
.login-input :deep(.q-field__control:after) {
  display: none;
}

.login-input :deep(.q-field__control:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.login-input :deep(.q-field--focused .q-field__control) {
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.login-input :deep(.q-field__native) {
  color: #ffffff !important;
  font-size: 14px;
}

.login-input :deep(.q-field__native::placeholder) {
  color: #71717a !important;
}

.login-input :deep(.q-icon) {
  color: #a1a1aa;
}

/* Error adjustments */
.login-input :deep(.q-field__messages) {
  color: #ef4444;
  padding-left: 4px;
  margin-top: 4px;
}

/* === BUTTON === */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: #000000 !important;
  background: #ffffff !important;
  border-radius: 12px !important;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background: #f4f4f5 !important;
  transform: translateY(-1px);
}

.login-btn:active {
  transform: translateY(0);
}

/* === ERROR === */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: #ef4444;
  font-size: 13px;
  margin-top: -4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* === FOOTER === */
.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
  margin-bottom: 16px;
}

.login-footer-text {
  font-size: 12px;
  color: #71717a;
}
</style>
