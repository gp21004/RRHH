<template>
  <q-page padding class="flex flex-center bg-grey-2">
    <div class="text-center full-width" style="max-width: 900px;">
      
      <q-icon name="apartment" size="80px" color="primary" class="q-mb-md" />
      <h3 class="text-h3 text-weight-bold text-primary q-mt-none q-mb-sm">Sistema de RRHH</h3>
      <p class="text-h6 text-grey-8 q-mb-xl">Selecciona un módulo para comenzar a trabajar</p>

      <div class="row q-col-gutter-lg justify-center">
        
        <div class="col-12 col-sm-6">
          <q-card class="cursor-pointer q-hoverable" @click="$router.push('/contratacion')" v-ripple>
            <q-card-section class="q-pa-xl bg-white text-primary">
              <q-icon name="people" size="64px" class="q-mb-md" />
              <div class="text-h5 text-weight-bold">Contratación y Personal</div>
              <div class="text-subtitle2 text-grey-7 q-mt-sm">Registra departamentos y nuevos empleados</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6">
          <q-card class="cursor-pointer q-hoverable" @click="$router.push('/planillas')" v-ripple>
            <q-card-section class="q-pa-xl bg-white text-secondary">
              <q-icon name="request_quote" size="64px" class="q-mb-md" />
              <div class="text-h5 text-weight-bold">Generación de Planillas</div>
              <div class="text-subtitle2 text-grey-7 q-mt-sm">Calcula ISSS, AFP y Renta automáticamente</div>
            </q-card-section>
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script setup>
// Espacio para futuras funcionalidades del dashboard
</script>

<style scoped>
/* Un pequeño efecto para que las tarjetas se eleven al pasar el mouse */
.q-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.q-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>