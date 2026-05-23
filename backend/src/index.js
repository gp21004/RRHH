// archivo: backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos nuestras nuevas rutas
const departamentoRoutes = require('./routes/departamento.routes.js');
const empleadoRoutes = require('./routes/empleado.routes.js');
const planillaRoutes = require('./routes/planilla.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const app = express();

app.use(cors());
app.use(express.json());

// Configuramos las URLs base para nuestra API
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/planillas', planillaRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.json({ mensaje: '¡El servidor del Sistema de Planillas SV está funcionando!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});