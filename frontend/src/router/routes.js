const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }, // El Dashboard
      { path: 'contratacion', component: () => import('pages/ContratacionPage.vue') }, // Módulo 1
      { path: 'planillas', component: () => import('pages/PlanillaPage.vue') }, // Módulo 2
      { path: 'historial', component: () => import('pages/HistorialPage.vue') } // Módulo 3
    ]
  },

  // Siempre deja esto al final para atrapar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes