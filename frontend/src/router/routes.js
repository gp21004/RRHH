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
      { path: '', component: () => import('pages/IndexPage.vue') }, // El Dashboard
      { path: 'contratacion', component: () => import('pages/ContratacionPage.vue') }, // Módulo 1
      { path: 'planillas', component: () => import('pages/PlanillaPage.vue') }, // Módulo 2
      { path: 'historial', component: () => import('pages/HistorialPage.vue') }, // Módulo 3
      { path: 'transacciones', component: () => import('pages/TransaccionesPage.vue') }, // Transacciones
      { path: 'contratos', component: () => import('pages/ContratosPage.vue') }, // Módulo 4
      { path: '/empleado/:id', name: 'detalle-empleado', component: () => import('components/DetalleEmpleado.vue') }, // Módulo 5
      { path: 'contrato/:id', name: 'contrato-detalle', component: () => import('components/ContratoDetalle.vue') }, // Módulo 6
      { path: '/planilla/:id', name: 'detalle-planilla', component: () => import('components/DetallePlanilla.vue') }, // Módulo 7
      {path: 'planilla/:planillaId/empleado/:empleadoId', name: 'detalle-empleado-planilla', component: () => import('components/DetalleEmpleadoPlanilla.vue')}, // Módulo 8
      { path: 'perfil', component: () => import('pages/PerfilPage.vue') }, // Perfil de usuario
      { path: 'configuracion', component: () => import('pages/ConfiguracionPage.vue') }, // Configuración
      {path: 'gestion-pago', component: () => import('pages/GestionPagoPage.vue')}
    ]
  },

  // Siempre deja esto al final para atrapar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes