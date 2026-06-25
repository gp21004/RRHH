<template>
  <div v-if="cargando" class="loading-page">
    <div class="spinner-wrapper">
      <q-spinner
        color="primary"
        size="60px"
      />
      <div class="text-subtitle2 q-mt-md text-center">
        Cargando empleados...
      </div>
    </div>
  </div>

  <q-page padding v-else>

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <q-btn
          flat
          icon="arrow_back"
          label="Volver al inicio"
          color="primary"
          class="text-weight-bold"
          to="/"
        />
      </div>
    </div>

    <div class="q-mb-lg">
      <div class="row items-center justify-between">

        <div>

          <div class="text-h5 text-weight-bold q-mb-xs">
            {{ editando ? 'Editar Empleado' : 'Registrar Empleado' }}
          </div>

          <div class="text-subtitle2 text-grey-7">
            {{
              editando
                ? 'Actualiza la información del empleado'
                : 'Completa la información del nuevo empleado'
            }}
          </div>

        </div>

        <q-btn
          flat
          icon="add"
          label="Nuevo Departamento"
          color="primary"
          size="md"
          @click="mostrarDialogoDepto = true"
        />

      </div>
    </div>

    <q-card class="q-mb-lg form-card">

      <q-card-section class="q-pa-lg">

        <q-form
          @submit.prevent="
            editando
              ? actualizarEmpleado()
              : guardarEmpleado()
          "
        >

          <div class="text-subtitle2 text-weight-bold q-mb-lg">
            Información Personal
          </div>

          <div class="row q-col-gutter-lg q-mb-lg">

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.nombres"
                label="Nombres *"
                required
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.apellidos"
                label="Apellidos *"
                required
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.dui"
                label="DUI *"
                mask="########-#"
                required
                class="form-input"
              />
            </div>

          </div>

          <div class="row q-col-gutter-lg q-mb-lg">

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.nit"
                label="NIT"
                mask="####-######-###-#"
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.nup_afp"
                label="NUP (AFP)"
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.fechaNacimiento"
                label="Fecha de Nacimiento"
                type="date"
                max="9999-12-31"
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-4">
              <q-input
                outlined
                v-model="empleado.fechaIngreso"
                label="Fecha de Ingreso"
                type="date"
                max="9999-12-31"
                class="form-input"
              />
            </div>

          </div>

          <div class="row q-col-gutter-lg q-mb-lg">



            <div class="col-12 col-sm-4">
              <q-select
                outlined
                v-model="empleado.departamentoId"
                :options="opcionesDepartamentos || []"
                option-label="nombre"
                option-value="id"
                emit-value
                map-options
                label="Departamento *"
                required
                class="form-input"
              />
            </div>

          </div>

          <div class="row q-col-gutter-lg q-mb-lg">

            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="empleado.telefono"
                label="Teléfono"
                type="tel"
                mask="+503 ####-####"
                class="form-input"
              />
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                outlined
                v-model="empleado.correo"
                label="Correo Electrónico"
                type="email"
                class="form-input"
              />
            </div>

          </div>

          <div class="q-mb-lg">
            <q-toggle
              v-model="empleado.estado"
              label="Empleado Activo"
              color="primary"
            />
          </div>

          <div class="row q-col-gutter-md">

            <div class="col-auto">
              <q-btn
                label="Limpiar"
                color="grey-7"
                flat
                @click="limpiarFormulario"
              />
            </div>

            <div
              class="col-auto"
              v-if="editando"
            >
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="cancelarEdicion"
              />
            </div>

            <q-space />

            <div class="col-auto" v-if="!editando">
              <q-btn
                label="Registrar e ir a Contratos"
                color="info"
                icon="description"
                @click="registrarYIrAContratos"
              />
            </div>

            <div class="col-auto">
              <q-btn
                :label="
                  editando
                    ? 'Actualizar Empleado'
                    : 'Registrar Empleado'
                "
                type="submit"
                color="primary"
                size="md"
              />
            </div>

          </div>

        </q-form>

      </q-card-section>

    </q-card>

    <div class="q-mb-md">
      <h2 class="text-h6 text-weight-bold q-ma-none">
        Listado de Empleados
      </h2>
    </div>

    <q-card class="q-mb-md filtros-card">

      <q-card-section class="q-pa-md">

        <div class="row q-col-gutter-md items-center">

          <div class="col-12 col-sm-4">
            <q-input
              outlined
              dense
              v-model="filtros.busqueda"
              label="Buscar empleado..."
              clearable
            />
          </div>

          <div class="col-12 col-sm-4">
            <q-select
              outlined
              dense
              v-model="filtros.departamento"
              :options="opcionesDepartamentos || []"
              option-label="nombre"
              option-value="id"
              emit-value
              map-options
              label="Todos los departamentos"
              clearable
            />
          </div>

          <div class="col-12 col-sm-4">
         <q-select
            outlined
            dense
            v-model="filtros.estado"
            :options="opcionesEstado"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Todos los estados"
            clearable
          />
          </div>

        </div>

      </q-card-section>

    </q-card>

    <q-card class="table-card">

      <q-table
        :rows="empleadosFiltrados"
        :columns="columnasEmpleados"
        row-key="id"
        flat
        bordered
        no-data-label="No se encontraron empleados"
        class="employees-table"
      >

        <template #body-cell-empleado="props">

          <q-td :props="props" class="empleado-cell">

            <div
              class="flex items-center"
              style="gap: 12px;"
            >

              <q-avatar
                size="md"
                text-color="white"
                :style="{ backgroundColor: getAvatarColor(props.row.nombres, props.row.apellidos) }"
                class="text-weight-bold"
              >
                {{ getInitials(props.row.nombres, props.row.apellidos) }}
              </q-avatar>

              <div style="flex: 1;">

                <div
                  class="text-weight-bold"
                  style="color: #e5e7eb;"
                >
                  {{ props.row.nombres }}
                  {{ props.row.apellidos }}
                </div>

              </div>

            </div>

          </q-td>

        </template>

        <template #body-cell-contacto="props">

          <q-td :props="props" class="contacto-cell">

            <div
              class="text-caption"
              style="color: #e5e7eb;"
            >

              <div
                v-if="props.row.correo"
                class="q-mb-xs"
              >
                {{ props.row.correo }}
              </div>

              <div
                v-if="props.row.telefono"
                style="color: #9ca3af;"
              >
                {{ props.row.telefono }}
              </div>

            </div>

          </q-td>

        </template>

        <template #body-cell-acciones="props">

          <q-td :props="props" class="acciones-cell">

            <div
              class="flex items-center justify-center"
              style="gap: 4px;"
            >

              <q-btn
                flat
                dense
                round
                icon="visibility"
                size="sm"
                color="primary"
                @click="verDetalle(props.row.id)"
              />

              <q-btn
                flat
                dense
                round
                icon="edit"
                size="sm"
                color="warning"
                @click="editarEmpleado(props.row)"
              />

              <q-btn
                flat
                dense
                round
                icon="delete"
                size="sm"
                color="negative"
                @click="eliminarEmpleado(props.row.id)"
              />

            </div>

          </q-td>

        </template>

      </q-table>

    </q-card>

    <q-dialog v-model="mostrarDialogoDepto">

      <q-card style="min-width: 400px">

        <q-card-section class="row items-center">

          <div class="text-h6">
            Nuevo Departamento
          </div>

          <q-space />

          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
          />

        </q-card-section>

        <q-separator />

        <q-card-section>

          <q-form
            @submit.prevent="guardarDepartamento"
            class="q-gutter-md"
          >

            <q-input
              outlined
              dense
              v-model="depto.nombre"
              label="Nombre del Departamento *"
              required
            />

            <q-input
              outlined
              dense
              v-model="depto.descripcion"
              label="Descripción"
              type="textarea"
              rows="3"
            />

            <q-btn
              label="Guardar Departamento"
              type="submit"
              color="primary"
              class="full-width"
            />

          </q-form>

        </q-card-section>

      </q-card>

    </q-dialog>

  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()

const verDetalle = (id) => {
  router.push({
    name: 'detalle-empleado',
    params: { id }
  })
}

const $q = useQuasar()

const cargando = ref(true)
const editando = ref(false)

  const empleadoInicial = {
    id: null,
    nombres: '',
    apellidos: '',
    dui: '',
    nit: '',
    nup_afp: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    departamentoId: null,
    telefono: '',
    correo: '',
    estado: true
  }

const depto = ref({
  nombre: '',
  descripcion: ''
})

const empleado = ref({ ...empleadoInicial })

const opcionesDepartamentos = ref([])
const listaEmpleados = ref([])

const mostrarDialogoDepto = ref(false)

const filtros = ref({
  busqueda: '',
  departamento: null,
  estado: null
})

const opcionesEstado = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
]

const empleadosFiltrados = computed(() => {

  return listaEmpleados.value.filter((emp) => {

    const coincideBusqueda =
      !filtros.value.busqueda ||
      `${emp.nombres} ${emp.apellidos}`
        .toLowerCase()
        .includes(
          filtros.value.busqueda.toLowerCase()
        )

    const coincideDepto =
      !filtros.value.departamento ||
      emp.departamento?.id === filtros.value.departamento ||
      emp.departamentoId === filtros.value.departamento

    const coincideEstado =
      filtros.value.estado === null ||
      emp.estado === filtros.value.estado

    return (
      coincideBusqueda &&
      coincideDepto &&
      coincideEstado
    )
  })
})
const columnasEmpleados = [
  {
    name: 'empleado',
    label: 'Empleado',
    field: 'nombres',
    align: 'left',
    sortable: true
  },
  {
    name: 'dui',
    label: 'DUI',
    field: 'dui',
    align: 'center'
  },
  {
    name: 'departamento',
    label: 'Departamento',
    field: row =>
      row.departamento
        ? row.departamento.nombre
        : 'Sin Depto',
    align: 'center'
  },

  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
    format: val => val ? 'Activo' : 'Inactivo'
  },
  {
    name: 'contacto',
    label: 'Contacto',
    field: 'correo',
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'id',
    align: 'center'
  }
]

const getInitials = (nombres, apellidos) => {
  const primerNombre = nombres ? nombres.trim().split(/\s+/)[0].charAt(0).toUpperCase() : ''
  const primerApellido = apellidos ? apellidos.trim().split(/\s+/)[0].charAt(0).toUpperCase() : ''
  return (primerNombre + primerApellido) || '?'
}

const getAvatarColor = (nombres, apellidos) => {
  const fullName = `${nombres || ''} ${apellidos || ''}`.trim()
  if (!fullName) return '#3b82f6'
  
  let hash = 0
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#3b82f6',
    '#10b981',
    '#8b5cf6',
    '#f97316',
    '#ef4444',
    '#06b6d4',
    '#ec4899'
  ]
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const cargarDepartamentos = async () => {
  try {
    const res = await fetch(
      'http://localhost:3000/api/departamentos'
    )

    opcionesDepartamentos.value =
      await res.json()

  } catch (error) {
    console.error(error)
  }
}

const cargarEmpleados = async () => {
  try {
    cargando.value = true
    const res = await fetch(
      'http://localhost:3000/api/empleados'
    )

    const data = await res.json()

    console.log('[v0] EMPLEADOS CARGADOS BACKEND:', data)

    listaEmpleados.value = Array.isArray(data)
      ? data.map(emp => ({
          ...emp,
          estado: emp.estado ?? true
        }))
      : []

    console.log('[v0] EMPLEADOS EN FRONTEND:', listaEmpleados.value)

  } catch (error) {
    console.error('[v0] Error cargando empleados:', error)
  } finally {
    cargando.value = false
  }
}
onMounted(async () => {

  // CARGAR DATOS
  await cargarDepartamentos()
  await cargarEmpleados()

  // VERIFICAR SI VIENE EN MODO EDICION
  const idEmpleado = route.query.editar

  if (idEmpleado) {

    console.log('[v0] ID RECIBIDO:', idEmpleado)

    // BUSCAR EMPLEADO
    const empleadoEncontrado =
      listaEmpleados.value.find(
        emp => Number(emp.id) === Number(idEmpleado)
      )

    console.log(
      '[v0] EMPLEADO ENCONTRADO:',
      empleadoEncontrado
    )

    // ACTIVAR MODO EDICION
    if (empleadoEncontrado) {
      editarEmpleado(empleadoEncontrado)
    }
  }
})
const guardarDepartamento = async () => {
  try {

    const res = await fetch(
      'http://localhost:3000/api/departamentos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(depto.value)
      }
    )

    if (res.ok) {

      $q.notify({
        type: 'positive',
        message: '¡Departamento guardado!',
        position: 'top'
      })

      depto.value = {
        nombre: '',
        descripcion: ''
      }

      mostrarDialogoDepto.value = false

      await cargarDepartamentos()
    }

  } catch (error) {
    console.error(error)
  }
}

const limpiarFormulario = () => {
  empleado.value = { ...empleadoInicial }
}

const crearEmpleadoAPI = async (datosEmpleado) => {
  try {
    const datosEnvio = {
      nombres: datosEmpleado.nombres,
      apellidos: datosEmpleado.apellidos,
      dui: datosEmpleado.dui,
      nit: datosEmpleado.nit,
      nup_afp: datosEmpleado.nup_afp,
      fechaNacimiento: datosEmpleado.fechaNacimiento || null,
      fechaIngreso: datosEmpleado.fechaIngreso || undefined,
      departamentoId: datosEmpleado.departamentoId,
      telefono: datosEmpleado.telefono,
      correo: datosEmpleado.correo,
      estado: datosEmpleado.estado
    }

    const res = await fetch(
      'http://localhost:3000/api/empleados',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEnvio)
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Error al registrar empleado')
    }

    return data
  } catch (error) {
    console.error('[v0] Error en crearEmpleadoAPI:', error)
    throw error
  }
}

const guardarEmpleado = async () => {
  try {
    await crearEmpleadoAPI(empleado.value)

    $q.notify({
      type: 'positive',
      message: '¡Empleado registrado!',
      position: 'top'
    })

    limpiarFormulario()
    await cargarEmpleados()

  } catch (error) {
    console.error('[v0] Error en guardarEmpleado:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al registrar empleado'
    })
  }
}

const editarEmpleado = (emp) => {

  console.log('[v0] Editando empleado:', emp)

  empleado.value = {
    id: emp.id,
    nombres: emp.nombres || '',
    apellidos: emp.apellidos || '',
    dui: emp.dui || '',
    nit: emp.nit || '',
    nup_afp: emp.nup_afp || '',
    fechaNacimiento: emp.fechaNacimiento
      ? emp.fechaNacimiento.split('T')[0]
      : '',
    fechaIngreso: emp.fechaIngreso
      ? emp.fechaIngreso.split('T')[0]
      : '',
    departamentoId: emp.departamentoId || null,
    telefono: emp.telefono || '',
    correo: emp.correo || '',
    estado: emp.estado ?? true
  }

  console.log('[v0] Datos del formulario cargados')

  editando.value = true

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const actualizarEmpleado = async () => {
  try {
    const datosEnvio = {
      nombres: empleado.value.nombres,
      apellidos: empleado.value.apellidos,
      dui: empleado.value.dui,
      nit: empleado.value.nit,
      nup_afp: empleado.value.nup_afp,
      fechaNacimiento: empleado.value.fechaNacimiento || null,
      fechaIngreso: empleado.value.fechaIngreso || undefined,
      departamentoId: empleado.value.departamentoId,
      telefono: empleado.value.telefono,
      correo: empleado.value.correo,
      estado: Boolean(empleado.value.estado),
    }

    console.log('[v0] Actualizando empleado con ID:', empleado.value.id)
    console.log('[v0] Datos enviados:', datosEnvio)

    const res = await fetch(
      `http://localhost:3000/api/empleados/${empleado.value.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEnvio)
      }
    )

    const data = await res.json()

    if (res.ok) {
      $q.notify({
        type: 'positive',
        message: 'Empleado actualizado correctamente'
      })

      cancelarEdicion()
      await cargarEmpleados()
    } else {
      console.error('[v0] Error en respuesta:', data)
      $q.notify({
        type: 'negative',
        message: data.error || 'Error al actualizar empleado'
      })
    }

  } catch (error) {
    console.error('[v0] Error en actualizarEmpleado:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar empleado'
    })
  }
}

const cancelarEdicion = () => {
  empleado.value = { ...empleadoInicial }
  editando.value = false
}

const registrarYIrAContratos = async () => {
  try {
    const data = await crearEmpleadoAPI(empleado.value)

    $q.notify({
      type: 'positive',
      message: '¡Empleado registrado! Redirigiendo a contratos...',
      position: 'top'
    })

    // Guardar el empleado registrado para pre-cargar en contratos
    sessionStorage.setItem('empleadoRecienRegistrado', JSON.stringify(data))

    // Redirigir a gestión de contratos
    router.push('/contratos')

  } catch (error) {
    console.error('[v0] Error en registrarYIrAContratos:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al registrar el empleado',
      position: 'top'
    })
  }
}

const eliminarEmpleado = (id) => {

  $q.dialog({
    title: 'Eliminar empleado',
    message: '¿Deseas eliminar este empleado?',
    cancel: true,
    persistent: true
  }).onOk(async () => {

    try {

      const res = await fetch(
        `http://localhost:3000/api/empleados/${id}`,
        {
          method: 'DELETE'
        }
      )

      const data = await res.json()

      if (res.ok) {
        $q.notify({
          type: 'positive',
          message: data.mensaje || 'Empleado eliminado correctamente'
        })

        await cargarEmpleados()
      } else {
        $q.notify({
          type: 'negative',
          message: data.error || 'No se pudo eliminar el empleado'
        })
      }

    } catch (error) {
      console.error('[v0] Error eliminando empleado:', error)
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el empleado'
      })
    }

  })
}
</script>

<style scoped>
.form-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-input {
  font-size: 14px;
}

.filtros-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.table-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.employees-table :deep(.q-table__card) {
  box-shadow: none;
  background-color: #2a2e3e;
}

.employees-table :deep(thead) {
  background-color: #3f4a5e;
}

.employees-table :deep(th) {
  background-color: #3f4a5e;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid #34394a;
  padding: 16px 12px;
}

.employees-table :deep(td) {
  padding: 16px 12px;
  border-bottom: 1px solid #34394a;
  color: #e5e7eb;
  background-color: #2a2e3e;
}

.employees-table :deep(tbody tr) {
  background-color: #2a2e3e;
}

.employees-table :deep(tbody tr:hover) {
  background-color: #34394a !important;
}

.employees-table :deep(tbody tr:hover td) {
  color: #f3f4f6 !important;
  background-color: #34394a !important;
}

.empleado-cell {
  background-color: #2a2e3e;
}

.contacto-cell {
  background-color: #2a2e3e;
}

.acciones-cell {
  background-color: #2a2e3e;
}

.text-dark {
  color: #1f2937;
}

.gap-md {
  gap: 12px;
}

.gap-xs {
  gap: 4px;
}

/* LOADING ANIMATIONS */
.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 48px); /* Full viewport height minus header/footer if any */
  padding: 40px;
  width: 100%;
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
</style>