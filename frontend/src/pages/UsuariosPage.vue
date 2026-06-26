<template>
  <q-page class="q-px-lg q-py-md page-container text-white">
    <!-- Header Page -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-white q-ma-none">Gestión de Accesos</h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm q-mb-none">Administra los usuarios (personas) y sus roles en el sistema.</p>
      </div>
    </div>

    <!-- Tabs para navegar entre Usuarios y Roles -->
    <q-card class="bg-dark text-white card-rounded custom-shadow">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey-5"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="usuarios" icon="person" label="Usuarios del Sistema" />
        <q-tab name="roles" icon="admin_panel_settings" label="Roles y Permisos" />
      </q-tabs>

      <q-separator dark />

      <q-tab-panels v-model="activeTab" animated class="bg-transparent">
        
        <!-- PESTAÑA 1: USUARIOS -->
        <q-tab-panel name="usuarios" class="q-pa-md">
          <div class="flex justify-between items-center q-mb-md">
            <h2 class="text-h6 text-weight-bold q-ma-none">Listado de Usuarios</h2>
            <q-btn color="primary" icon="person_add" label="Crear Nuevo Usuario" class="rounded-borders" unelevated @click="openUserModal()" />
          </div>

          <q-table
            :rows="usuarios"
            :columns="userColumns"
            row-key="id"
            dark
            flat
            class="bg-transparent text-white"
            no-data-label="No hay usuarios registrados"
          >
            <!-- Rol Column -->
            <template v-slot:body-cell-rol="props">
              <q-td :props="props">
                <q-chip color="accent" text-color="white" size="sm" class="q-ma-none" dense>
                  {{ props.row.rol }}
                </q-chip>
              </q-td>
            </template>

            <!-- Acciones Column -->
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense color="info" icon="edit" @click="openUserModal(props.row)">
                  <q-tooltip>Editar Usuario</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteUser(props.row)" :disable="props.row.id === 1">
                  <q-tooltip v-if="props.row.id === 1">Usuario principal (No se puede eliminar)</q-tooltip>
                  <q-tooltip v-else>Eliminar Usuario</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- PESTAÑA 2: ROLES -->
        <q-tab-panel name="roles" class="q-pa-md">
          <div class="flex justify-between items-center q-mb-md">
            <h2 class="text-h6 text-weight-bold q-ma-none">Listado de Roles</h2>
            <q-btn color="primary" icon="add" label="Crear Nuevo Rol" class="rounded-borders" unelevated @click="openRoleModal()" />
          </div>

          <q-table
            :rows="roles"
            :columns="roleColumns"
            row-key="id"
            dark
            flat
            class="bg-transparent text-white"
            no-data-label="No hay roles creados"
          >
            <!-- Permisos Custom Column -->
            <template v-slot:body-cell-permisos="props">
              <q-td :props="props">
                <div class="flex gap-sm">
                  <q-chip
                    v-for="(perm, index) in props.row.permisos"
                    :key="index"
                    color="primary"
                    text-color="white"
                    size="sm"
                    class="q-ma-none"
                    dense
                  >
                    {{ formatPermissionName(perm) }}
                  </q-chip>
                  <span v-if="!props.row.permisos || props.row.permisos.length === 0" class="text-grey-7 text-caption">Sin permisos</span>
                </div>
              </q-td>
            </template>

            <!-- Acciones Custom Column -->
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props" class="text-right">
                <q-btn flat round dense color="info" icon="edit" @click="openRoleModal(props.row)">
                  <q-tooltip>Editar Rol</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete" @click="confirmDeleteRole(props.row)" :disable="props.row.isDefault">
                  <q-tooltip v-if="props.row.isDefault">Rol por defecto (No se puede eliminar)</q-tooltip>
                  <q-tooltip v-else>Eliminar Rol</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>

    <!-- Modal para Crear/Editar Usuario -->
    <q-dialog v-model="showUserModal" persistent dark>
      <q-card class="bg-dark text-white card-rounded" style="min-width: 400px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-weight-bold">{{ isEditingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveUser" class="q-gutter-md">
            <!-- Nombre Completo -->
            <q-input
              v-model="userForm.nombreCompleto"
              label="Nombre Completo"
              outlined
              dense
              dark
              color="primary"
              :rules="[val => !!val || 'El nombre es requerido']"
            />

            <!-- Correo / Username -->
            <q-input
              v-model="userForm.correo"
              label="Correo Electrónico (Usuario)"
              type="email"
              outlined
              dense
              dark
              color="primary"
              :rules="[val => !!val || 'El correo es requerido']"
            />

            <!-- Contraseña -->
            <q-input
              v-model="userForm.password"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              dark
              color="primary"
              :rules="isEditingUser ? [] : [val => !!val || 'La contraseña es requerida']"
              :hint="isEditingUser ? 'Dejar en blanco si no desea cambiarla' : ''"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <!-- Selección de Rol -->
            <q-select
              v-model="userForm.rol"
              :options="roles"
              option-value="nombre"
              option-label="nombre"
              emit-value
              map-options
              label="Asignar Rol"
              outlined
              dense
              dark
              color="primary"
              :rules="[val => !!val || 'Debe seleccionar un rol']"
            >
              <template v-slot:append>
                <q-icon name="admin_panel_settings" />
              </template>
            </q-select>

            <!-- Acciones Modal -->
            <div class="flex justify-end gap-sm q-mt-lg">
              <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
              <q-btn unelevated type="submit" label="Guardar" color="primary" class="rounded-borders" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para Crear/Editar Rol -->
    <q-dialog v-model="showRoleModal" persistent dark>
      <q-card class="bg-dark text-white card-rounded" style="min-width: 400px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-weight-bold">{{ isEditingRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveRole" class="q-gutter-md">
            <!-- Nombre del Rol -->
            <q-input
              v-model="roleForm.nombre"
              label="Nombre del Rol"
              outlined
              dense
              dark
              color="primary"
              :rules="[val => !!val || 'El nombre es requerido']"
            />

            <!-- Descripción del Rol -->
            <q-input
              v-model="roleForm.descripcion"
              label="Descripción"
              type="textarea"
              outlined
              dense
              dark
              color="primary"
              rows="3"
            />

            <!-- Permisos del Rol -->
            <div>
              <div class="text-subtitle2 text-grey-5 q-mb-sm">Permisos (Módulos accesibles):</div>
              <div class="row q-col-gutter-sm">
                <div v-for="modulo in modulosDisponibles" :key="modulo.id" class="col-12 col-sm-6">
                  <q-checkbox
                    v-model="roleForm.permisos"
                    :val="modulo.id"
                    :label="modulo.nombre"
                    dark
                    color="primary"
                  />
                </div>
              </div>
            </div>

            <!-- Acciones Modal -->
            <div class="flex justify-end gap-sm q-mt-lg">
              <q-btn flat label="Cancelar" color="grey-5" v-close-popup />
              <q-btn unelevated type="submit" label="Guardar" color="primary" class="rounded-borders" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- ESTADOS Y VARIABLES ---
const activeTab = ref('usuarios')

// Variables Modal Usuarios
const showUserModal = ref(false)
const isEditingUser = ref(false)
const showPassword = ref(false)
const userForm = ref({
  id: null,
  nombreCompleto: '',
  correo: '',
  password: '',
  rol: null
})

// Variables Modal Roles
const showRoleModal = ref(false)
const isEditingRole = ref(false)
const roleForm = ref({
  id: null,
  nombre: '',
  descripcion: '',
  permisos: [],
  isDefault: false
})

// Lista de módulos disponibles en el sistema para asignar permisos
const modulosDisponibles = [
  { id: 'dashboard', nombre: 'Dashboard' },
  { id: 'contratacion', nombre: 'Contratación y Personal' },
  { id: 'planillas', nombre: 'Generación de Planillas' },
  { id: 'historial', nombre: 'Historial de Planillas' },
  { id: 'transacciones', nombre: 'Transacciones' },
  { id: 'contratos', nombre: 'Gestión de Contratos' },
  { id: 'configuracion', nombre: 'Configuración del Sistema' },
  { id: 'gestion-pagos', nombre: 'Gestión de Pagos' }
]

// Columnas Tabla Usuarios
const userColumns = [
  { name: 'nombreCompleto', align: 'left', label: 'Nombre Completo', field: 'nombreCompleto', sortable: true },
  { name: 'correo', align: 'left', label: 'Correo (Usuario)', field: 'correo', sortable: true },
  { name: 'rol', align: 'left', label: 'Rol Asignado', field: 'rol', sortable: true },
  { name: 'acciones', align: 'right', label: 'Acciones', field: 'acciones' }
]

// Columnas Tabla Roles
const roleColumns = [
  { name: 'nombre', align: 'left', label: 'Nombre del Rol', field: 'nombre', sortable: true },
  { name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion' },
  { name: 'permisos', align: 'left', label: 'Permisos', field: 'permisos' },
  { name: 'acciones', align: 'right', label: 'Acciones', field: 'acciones' }
]

// Datos MOCK de roles
const roles = ref([
  { id: 1, nombre: 'Administrador', descripcion: 'Acceso total.', permisos: ['dashboard', 'contratacion', 'planillas', 'historial', 'transacciones', 'contratos', 'configuracion', 'gestion-pagos'], isDefault: true },
  { id: 2, nombre: 'Recursos Humanos', descripcion: 'Gestión de personal.', permisos: ['dashboard', 'contratacion', 'planillas', 'contratos'], isDefault: false },
  { id: 3, nombre: 'Finanzas', descripcion: 'Acceso a pagos.', permisos: ['dashboard', 'historial', 'transacciones', 'gestion-pagos'], isDefault: false }
])

// Datos MOCK de usuarios
const usuarios = ref([
  { id: 1, nombreCompleto: 'Kevin Administrador', correo: 'admin@gestionpro.com', rol: 'Administrador' },
  { id: 2, nombreCompleto: 'María Lopez', correo: 'mlopez@gestionpro.com', rol: 'Recursos Humanos' },
  { id: 3, nombreCompleto: 'Carlos Ruiz', correo: 'cruiz@gestionpro.com', rol: 'Finanzas' }
])

// --- MÉTODOS ---

// Helper para mostrar un nombre amigable del permiso en los chips
const formatPermissionName = (permId) => {
  const modulo = modulosDisponibles.find(m => m.id === permId)
  return modulo ? modulo.nombre : permId
}

// ------------------- LÓGICA DE USUARIOS -------------------
const openUserModal = (user = null) => {
  showPassword.value = false
  if (user) {
    isEditingUser.value = true
    userForm.value = { ...user, password: '' } // no enviamos el password al form
  } else {
    isEditingUser.value = false
    userForm.value = { id: null, nombreCompleto: '', correo: '', password: '', rol: null }
  }
  showUserModal.value = true
}

const saveUser = async () => {
  try {
    // --- Lógica MOCK ---
    // TODO: Reemplazar con llamada al backend (POST/PUT a /api/usuarios)
    if (isEditingUser.value) {
      const index = usuarios.value.findIndex(u => u.id === userForm.value.id)
      if (index !== -1) {
        // En la vida real, solo actualizas password si no viene vacío
        usuarios.value[index] = { ...userForm.value }
      }
    } else {
      const newId = usuarios.value.length > 0 ? Math.max(...usuarios.value.map(u => u.id)) + 1 : 1
      usuarios.value.push({ ...userForm.value, id: newId })
    }

    showUserModal.value = false
    $q.notify({ type: 'positive', message: isEditingUser.value ? 'Usuario actualizado correctamente.' : 'Usuario creado exitosamente.' })
  } catch (error) {
    console.error('Error guardando usuario:', error)
    $q.notify({ type: 'negative', message: 'Error al guardar el usuario.' })
  }
}

const confirmDeleteUser = (user) => {
  $q.dialog({
    title: 'Eliminar Usuario',
    message: `¿Estás seguro de que deseas eliminar al usuario <strong>${user.nombreCompleto}</strong>?`,
    html: true,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-5' },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
    dark: true,
    persistent: true
  }).onOk(() => {
    // --- Lógica MOCK ---
    // TODO: Reemplazar con llamada al backend (DELETE)
    usuarios.value = usuarios.value.filter(u => u.id !== user.id)
    $q.notify({ type: 'positive', message: 'Usuario eliminado correctamente.' })
  })
}

// ------------------- LÓGICA DE ROLES -------------------
const openRoleModal = (rol = null) => {
  if (rol) {
    isEditingRole.value = true
    roleForm.value = { ...rol, permisos: [...(rol.permisos || [])] }
  } else {
    isEditingRole.value = false
    roleForm.value = { id: null, nombre: '', descripcion: '', permisos: [], isDefault: false }
  }
  showRoleModal.value = true
}

const saveRole = async () => {
  try {
    // --- Lógica MOCK ---
    // TODO: Reemplazar con llamada al backend (POST/PUT a /api/roles)
    if (isEditingRole.value) {
      const index = roles.value.findIndex(r => r.id === roleForm.value.id)
      if (index !== -1) {
        roles.value[index] = { ...roleForm.value }
      }
    } else {
      const newId = roles.value.length > 0 ? Math.max(...roles.value.map(r => r.id)) + 1 : 1
      roles.value.push({ ...roleForm.value, id: newId })
    }

    showRoleModal.value = false
    $q.notify({ type: 'positive', message: isEditingRole.value ? 'Rol actualizado correctamente.' : 'Rol creado exitosamente.' })
  } catch (error) {
    console.error('Error guardando el rol:', error)
    $q.notify({ type: 'negative', message: 'Error al guardar el rol.' })
  }
}

const confirmDeleteRole = (rol) => {
  $q.dialog({
    title: 'Eliminar Rol',
    message: `¿Estás seguro de que deseas eliminar el rol <strong>${rol.nombre}</strong>?`,
    html: true,
    cancel: { label: 'Cancelar', flat: true, color: 'grey-5' },
    ok: { label: 'Eliminar', color: 'negative', unelevated: true },
    dark: true,
    persistent: true
  }).onOk(() => {
    // --- Lógica MOCK ---
    // TODO: Reemplazar con llamada al backend (DELETE a /api/roles)
    roles.value = roles.value.filter(r => r.id !== rol.id)
    $q.notify({ type: 'positive', message: 'Rol eliminado correctamente.' })
  })
}

onMounted(() => {
  // Aquí cargaríamos datos iniciales de la DB: cargarRoles() y cargarUsuarios()
})
</script>

<style scoped>
/* ESTILOS NEUMORPHIC DARK THEME */
.page-container {
  background-color: transparent;
  min-height: 100vh;
}

:deep(.bg-dark) {
  background-color: #2C313C !important;
}

.card-rounded {
  border-radius: 16px !important;
}

.custom-shadow {
  box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
  border: 1px solid rgba(255,255,255,0.05);
}

.rounded-borders {
  border-radius: 12px;
}

.gap-sm {
  gap: 8px;
}

/* Modificar estilo de tabla en modo oscuro */
:deep(.q-table__container) {
  background-color: transparent !important;
}

:deep(.q-table th) {
  font-weight: 600;
  font-size: 14px;
  color: #94A3B8; /* grey-5 approx */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.q-table td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Ajustes de inputs en modo oscuro */
:deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.15) !important;
}

:deep(.q-field--outlined:hover .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
