const routes = [
  // Ruta de Login (sin layout principal)
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { public: true }
  },

  // Rutas protegidas (con layout principal)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { permiso: 'dashboard' } }, // El Dashboard
      { path: 'contratacion', component: () => import('pages/ContratacionPage.vue'), meta: { permiso: 'contratacion' } }, // Módulo 1
      { path: 'planillas', component: () => import('pages/PlanillaPage.vue'), meta: { permiso: 'planillas' } }, // Módulo 2
      { path: 'historial', component: () => import('pages/HistorialPage.vue'), meta: { permiso: 'historial' } }, // Módulo 3
      { path: 'transacciones', component: () => import('pages/TransaccionesPage.vue'), meta: { permiso: 'transacciones' } }, // Transacciones
      { path: 'contratos', component: () => import('pages/ContratosPage.vue'), meta: { permiso: 'contratos' } }, // Módulo 4
      { path: '/empleado/:id', name: 'detalle-empleado', component: () => import('components/DetalleEmpleado.vue'), meta: { permiso: 'contratacion' } }, // Módulo 5
      { path: 'contrato/:id', name: 'contrato-detalle', component: () => import('components/ContratoDetalle.vue'), meta: { permiso: 'contratos' } }, // Módulo 6
      { path: '/planilla/:id', name: 'detalle-planilla', component: () => import('components/DetallePlanilla.vue'), meta: { permiso: 'planillas' } }, // Módulo 7
      { path: 'planilla/:planillaId/empleado/:empleadoId', name: 'detalle-empleado-planilla', component: () => import('components/DetalleEmpleadoPlanilla.vue'), meta: { permiso: 'planillas' }}, // Módulo 8
      { path: 'perfil', component: () => import('pages/PerfilPage.vue') }, // Perfil de usuario (Siempre accesible)
      { path: 'configuracion', component: () => import('pages/ConfiguracionPage.vue'), meta: { permiso: 'configuracion' } }, // Configuración
      { path: 'gestion-pago', component: () => import('pages/GestionPagoPage.vue'), meta: { permiso: 'gestion-pagos' } },
      { path: 'usuarios', component: () => import('pages/UsuariosPage.vue'), meta: { permiso: 'configuracion' } } // Gestión de usuarios y roles
    ]
  },

  // Siempre deja esto al final para atrapar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes