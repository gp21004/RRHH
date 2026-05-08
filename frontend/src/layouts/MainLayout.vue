<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-dark text-white">
      <q-toolbar class="px-md">
        <!-- Logo y Título -->
        <div class="flex items-center gap-md">
          <q-btn flat dense round icon="menu" @click="toggleDrawer" class="text-white" />
          <div class="text-h6 font-weight-bold ">GestionPro</div>
        </div>

        <q-space />

        <!-- Acciones Header -->
        <div class="flex items-center gap-md">
          <!-- Notificaciones -->
          <q-btn flat dense round icon="notifications" class="text-white">
            <q-badge color="red" floating rounded size="sm">3</q-badge>
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 300px">
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="check_circle" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Pago procesado</q-item-label>
                    <q-item-label caption>Hace 2 minutos</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="warning" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Contrato pendiente</q-item-label>
                    <q-item-label caption>Hace 1 hora</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Perfil Usuario -->
          <q-btn flat dense round>
            <q-avatar size="40px" color="primary" text-color="white" icon="person" />
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 200px">
                <q-item-label header>John Doe</q-item-label>
                <q-separator />
                <q-item clickable v-ripple to="/perfil">
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Mi Perfil</q-item-section>
                </q-item>
                <q-item clickable v-ripple to="/configuracion">
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Configuración</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Cerrar Sesión</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER/SIDEBAR -->
    <q-drawer
      v-model="showDrawer"
      show-if-above
      elevated
      class="bg-dark"
      :width="250"
      :breakpoint="1024"
    >
      <!-- Encabezado Drawer -->
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <q-item 
            clickable
            v-ripple
            to="/"
            :active="$route.path === '/'">
            <q-item-section avatar>
              <q-icon name="dashboard" color="primary" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6 font-weight-bold text-white">Dashboard</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Menú Principal -->
        <q-list separator class="text-white">
          <!-- Sección Pagos -->
          <q-item-label header class="text-uppercase text-weight-bold text-grey">
            Pagos
          </q-item-label>

          <q-item
            clickable
            v-ripple
            to="/pagos"
            :active="$route.path === '/pagos'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="credit_card" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Gestionar Pagos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/invoices"
            :active="$route.path === '/invoices'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Facturas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/transacciones"
            :active="$route.path === '/transacciones'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-md"
          >
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Transacciones</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Sección Contratación -->
          <q-item-label header class="text-uppercase text-weight-bold text-grey">
            Contratación
          </q-item-label>

          <q-item
            clickable
            v-ripple
            to="/contratos"
            :active="$route.path === '/contratos'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Contratos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/contratacion"
            :active="$route.path === '/contratacion'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Personal</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/planillas"
            :active="$route.path === '/planillas'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-md"
          >
            <q-item-section avatar>
              <q-icon name="table_chart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Planillas</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Sección Usuarios -->
          <q-item-label header class="text-uppercase text-weight-bold text-grey">
            Administración
          </q-item-label>

          <q-item
            clickable
            v-ripple
            to="/usuarios"
            :active="$route.path === '/usuarios'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usuarios</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/historial"
            :active="$route.path === '/historial'"
            active-class="bg-primary text-white"
            class="rounded-borders q-mb-sm"
          >
            <q-item-section avatar>
              <q-icon name="analytics" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reportes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/configuracion"
            :active="$route.path === '/configuracion'"
            active-class="bg-primary text-white"
            class="rounded-borders"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Configuración</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Footer Drawer -->
      <q-separator class="my-md" />
      <div class="q-pa-md text-center text-grey-7 text-caption">
        <div>GestionPro v1.0</div>
        <div>© 2024 Todos los derechos reservados</div>
      </div>
    </q-drawer>

    <!-- PÁGINA PRINCIPAL -->
    <q-page-container>
      <div class="bg-grey-2 min-h-screen">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const showDrawer = ref(true)

const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}
</script>

<style scoped>
:deep(.bg-dark) {
  background-color: #000000;
}

:deep(.text-grey) {
  color: #888;
}

:deep(.text-grey-7) {
  color: #999;
}

:deep(.rounded-borders) {
  border-radius: 8px;
}

:deep(.bg-grey-2) {
  background-color: #f5f5f5;
}

:deep(.min-h-screen) {
  min-height: 100vh;
}

:deep(.gap-md) {
  gap: 16px;
}

:deep(.px-md) {
  padding-left: 16px;
  padding-right: 16px;
}

:deep(.q-pa-md) {
  padding: 16px;
}

:deep(.my-md) {
  margin-top: 16px;
  margin-bottom: 16px;
}

:deep(.flex) {
  display: flex;
}

:deep(.items-center) {
  align-items: center;
}
</style>
