require('dotenv').config();
const express    = require('express');
const path       = require('path');
const conexion   = require('./config/database');

// Importar modelos (para que Sequelize los registre antes del sync)
require('./models/Usuario');
require('./models/Libro');
require('./models/Prestamo');

// Importar rutas
const authRoutes     = require('./routes/authRoutes');
const usuarioRoutes  = require('./routes/usuarioRoutes');
const libroRoutes    = require('./routes/libroRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');

const app = express();

// ── Middlewares globales ──────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Servir archivos estáticos ────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Rutas de la API ──────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/usuarios',  usuarioRoutes);
app.use('/api/libros',    libroRoutes);
app.use('/api/prestamos', prestamoRoutes);

// ── Servir vistas HTML ───────────────────────
app.get('/',           (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/registro',   (req, res) => res.sendFile(path.join(__dirname, 'views', 'registro.html')));
app.get('/catalogo',   (req, res) => res.sendFile(path.join(__dirname, 'views', 'catalogo.html')));
app.get('/prestamos',  (req, res) => res.sendFile(path.join(__dirname, 'views', 'prestamos.html')));
app.get('/admin',      (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));

// ── Sincronizar BD e iniciar servidor ────────
const PORT = process.env.PORT || 3000;

conexion.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa');
    return conexion.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });
