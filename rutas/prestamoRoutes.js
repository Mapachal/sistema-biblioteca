const express = require('express');
const router  = express.Router();
const {
  solicitarPrestamo, aprobarPrestamo, registrarDevolucion,
  misPrestamos, todosPrestamos, obtenerPrestamo
} = require('../controllers/prestamoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Rutas de usuario
router.post('/',          solicitarPrestamo);
router.get('/mis',        misPrestamos);

// Rutas de administrador
router.get('/',               roleMiddleware('admin'), todosPrestamos);
router.get('/:id',            roleMiddleware('admin'), obtenerPrestamo);
router.put('/:id/aprobar',    roleMiddleware('admin'), aprobarPrestamo);
router.put('/:id/devolucion', roleMiddleware('admin'), registrarDevolucion);

module.exports = router;
