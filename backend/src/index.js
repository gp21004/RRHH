const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializamos la aplicación
const app = express();

// Middlewares (Para que tu backend entienda JSON y permita peticiones del frontend)
app.use(cors());
app.use(express.json());

// Una ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.json({ mensaje: '¡El servidor del Sistema de Planillas SV está funcionando!' });
});

// Definimos el puerto (usaremos el 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Encendemos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});