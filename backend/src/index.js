// archivo: backend/src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importamos nuestras nuevas rutas
const departamentoRoutes = require('./routes/departamento.routes.js');
const empleadoRoutes = require('./routes/empleado.routes.js');
const planillaRoutes = require('./routes/planilla.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const contratoRoutes = require('./routes/contrato.routes.js');
const marcacionRoutes = require('./routes/marcacion.routes.js');
const contratoDocumentoRoutes = require('./routes/contratoDocumento.routes.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuramos las URLs base para nuestra API
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/planillas', planillaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contratos', contratoRoutes);
app.use('/api/marcaciones', marcacionRoutes);
app.use('/api/documentos', contratoDocumentoRoutes);
app.get('/', (req, res) => {
    res.json({ mensaje: '¡El servidor del Sistema de Planillas SV está funcionando!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});