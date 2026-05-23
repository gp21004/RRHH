<template>
  <div class="login-container">
    <!-- Animated Background -->
    <div class="login-bg">
      <div class="login-bg-circle login-bg-circle--1"></div>
      <div class="login-bg-circle login-bg-circle--2"></div>
      <div class="login-bg-circle login-bg-circle--3"></div>
    </div>

    <!-- Login Card -->
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="login-logo">
          <q-icon name="dashboard_customize" size="48px" color="primary" />
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
            outlined
            dense
            placeholder="Ingrese su usuario"
            :rules="[val => !!val || 'El usuario es requerido']"
            lazy-rules
            dark
            class="login-input"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" color="grey-5" />
            </template>
          </q-input>
        </div>

        <div class="login-field">
          <label class="login-label">Contraseña</label>
          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            placeholder="Ingrese su contraseña"
            :rules="[val => !!val || 'La contraseña es requerida']"
            lazy-rules
            dark
            class="login-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock_outline" color="grey-5" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-5"
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
          color="primary"
          no-caps
          unelevated
          :loading="loading"
          class="login-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots size="24px" />
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
  background: #1a1d23;
}

/* === ANIMATED BACKGROUND === */
.login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.login-bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

.login-bg-circle--1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.login-bg-circle--2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  bottom: -100px;
  right: -80px;
  animation-delay: -7s;
}

.login-bg-circle--3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #00cec9, #55efc4);
  top: 50%;
  left: 60%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(40px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 40px) scale(0.95); }
  75% { transform: translate(30px, 20px) scale(1.02); }
}

/* === LOGIN CARD === */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background: rgba(44, 49, 60, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  margin: 16px;
}

/* === HEADER === */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.2), rgba(108, 92, 231, 0.2));
  border-radius: 20px;
  border: 1px solid rgba(74, 144, 226, 0.3);
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
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
  gap: 6px;
}

.login-label {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.login-input :deep(.q-field__control) {
  background: rgba(15, 23, 42, 0.5) !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.login-input :deep(.q-field__control:hover) {
  border-color: rgba(74, 144, 226, 0.3) !important;
}

.login-input :deep(.q-field--focused .q-field__control) {
  border-color: #4a90e2 !important;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15) !important;
}

.login-input :deep(.q-field__native) {
  color: #e2e8f0 !important;
}

.login-input :deep(.q-field__native::placeholder) {
  color: #64748b !important;
}

/* === ERROR === */
.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 13px;
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

/* === BUTTON === */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px !important;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, #4a90e2, #357abd) !important;
  transition: all 0.3s ease;
  margin-top: 4px;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.35);
}

.login-btn:active {
  transform: translateY(0);
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
  color: #475569;
}

/* === RESPONSIVE === */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
    border-radius: 20px;
  }
}
</style>
