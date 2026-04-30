require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./config/asosiations');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ── Rutas ───
app.use('/api', routes);

// Para verificar que el server si esta corriendo
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando correctamente' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Ruta ${req.method} ${req.path} no encontrada` });
});

// Control de errores 
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Verifica conexión con la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida');

    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados con la base de datos');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err.message);
    process.exit(1);
  }
}

iniciar();
