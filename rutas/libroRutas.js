const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Solo admin puede crear, actualizar y eliminar
router.post('/', authMiddleware, roleMiddleware('admin'), libroController.crearLibro);
router.put('/:id', authMiddleware, roleMiddleware('admin'), libroController.actualizarLibro);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), libroController.eliminarLibro);

// Todos los usuarios pueden ver libros
router.get('/', authMiddleware, libroController.obtenerLibros);
router.get('/buscar', authMiddleware, libroController.buscarLibroPorTitulo);
router.get('/:id', authMiddleware, libroController.obtenerLibroPorId);

module.exports = router;
