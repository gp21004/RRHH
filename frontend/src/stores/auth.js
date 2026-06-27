// archivo: frontend/src/stores/auth.js
import { reactive, computed } from 'vue'

const API_URL = 'http://localhost:3000/api/auth'

const state = reactive({
  user: null,
  token: null
})

// Computed
const isAuthenticated = computed(() => !!state.token && !!state.user)
const userName = computed(() => state.user?.nombreCompleto || 'Usuario')
const userRole = computed(() => state.user?.rol || '')
const isAdmin = computed(() => {
  const rol = state.user?.rol?.toLowerCase() || ''
  return rol === 'admin' || rol === 'administrador'
})
const userInitials = computed(() => {
  if (!state.user?.nombreCompleto) return 'U'
  const parts = state.user.nombreCompleto.split(' ')
  return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase()
})

// Cargar sesión desde localStorage
function loadSession() {
  const token = localStorage.getItem('gp_token')
  const user = localStorage.getItem('gp_user')

  if (token && user) {
    state.token = token
    state.user = JSON.parse(user)
    return true
  }
  return false
}

// Login
async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Error al iniciar sesión')
  }

  state.token = data.token
  state.user = data.usuario

  localStorage.setItem('gp_token', data.token)
  localStorage.setItem('gp_user', JSON.stringify(data.usuario))

  return data
}

// Logout
function logout() {
  state.token = null
  state.user = null
  localStorage.removeItem('gp_token')
  localStorage.removeItem('gp_user')
}

// Obtener perfil actualizado
async function fetchProfile() {
  const response = await fetch(`${API_URL}/perfil`, {
    headers: {
      'Authorization': `Bearer ${state.token}`
    }
  })

  if (!response.ok) {
    if (response.status === 401) {
      logout()
      throw new Error('Sesión expirada')
    }
    throw new Error('Error al obtener perfil')
  }

  const user = await response.json()
  state.user = user
  localStorage.setItem('gp_user', JSON.stringify(user))
  return user
}

// Actualizar perfil
async function updateProfile(nombreCompleto, correo) {
  const response = await fetch(`${API_URL}/perfil`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.token}`
    },
    body: JSON.stringify({ nombreCompleto, correo })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Error al actualizar perfil')
  }

  state.user = data.usuario
  localStorage.setItem('gp_user', JSON.stringify(data.usuario))
  return data
}

// Cambiar contraseña
async function changePassword(passwordActual, passwordNuevo) {
  const response = await fetch(`${API_URL}/cambiar-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.token}`
    },
    body: JSON.stringify({ passwordActual, passwordNuevo })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Error al cambiar contraseña')
  }

  return data
}

export function useAuth() {
  return {
    state,
    isAuthenticated,
    userName,
    userRole,
    isAdmin,
    userInitials,
    loadSession,
    login,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    hasPermission
  }
}

// Mock temporal de permisos por rol para el Route Guard
const rolePermissions = {
  admin: ['dashboard', 'contratacion', 'planillas', 'historial', 'transacciones', 'contratos', 'configuracion', 'gestion-pagos'],
  'recursos-humanos': ['dashboard', 'contratacion', 'planillas', 'contratos'],
  finanzas: ['dashboard', 'historial', 'transacciones', 'gestion-pagos'],
  empleado: ['dashboard', 'perfil']
}

function hasPermission(modulo) {
  if (!modulo) return true // Ruta sin protección específica
  
  const rolActual = state.user?.rol?.toLowerCase() || ''
  
  // Hardcode administrador
  if (rolActual === 'admin' || rolActual === 'administrador') return true
  
  const permisosDelRol = rolePermissions[rolActual] || []
  return permisosDelRol.includes(modulo)
}
