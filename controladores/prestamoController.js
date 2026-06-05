const Prestamo = require('../models/Prestamo');
const Libro    = require('../models/Libro');
const Usuario  = require('../models/Usuario');
const { Op }   = require('sequelize');

// USUARIO: Solicitar préstamo
const solicitarPrestamo = async (req, res) => {
  try {
    console.log('📌 Solicitud de préstamo recibida');
    const { libroId } = req.body;
    const usuarioId   = req.usuario.id;
    console.log('📌 usuarioId:', usuarioId, 'libroId:', libroId);

    const libro = await Libro.findByPk(libroId);
    if (!libro) return res.status(404).json({ mensaje: 'Libro no encontrado' });
    if (libro.cantidad < 1) return res.status(400).json({ mensaje: 'Sin ejemplares disponibles' });
    console.log('📌 Libro encontrado:', libro.titulo, 'cantidad:', libro.cantidad);

    // Verificar si ya hay un préstamo activo de este libro
    console.log('📌 Verificando préstamos pendientes...');
    const prestamosPendientes = await Prestamo.findOne({
      where: { usuarioId: usuarioId, libroId: libroId, estado: 'pendiente' }
    });
    console.log('📌 Préstamos pendientes:', prestamosPendientes ? 'SÍ' : 'NO');
    
    console.log('📌 Verificando préstamos prestados...');
    const prestamosPrestados = await Prestamo.findOne({
      where: { usuarioId: usuarioId, libroId: libroId, estado: 'prestado' }
    });
    console.log('📌 Préstamos prestados:', prestamosPrestados ? 'SÍ' : 'NO');
    
    if (prestamosPendientes || prestamosPrestados) {
      return res.status(400).json({ mensaje: 'Ya tienes un préstamo activo de este libro' });
    }

    console.log('📌 Creando nuevo préstamo...');
    // Generar código de préstamo
    const codigoPrestamo = require('crypto').randomBytes(8).toString('hex').toUpperCase();
    console.log('📌 Código generado:', codigoPrestamo);
    
    const prestamo = await Prestamo.create({ usuarioId, libroId, codigoPrestamo });
    console.log('📌 Préstamo creado:', prestamo);
    res.status(201).json({ mensaje: 'Solicitud registrada', prestamo });
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('❌ STACK:', error.stack);
    res.status(500).json({ mensaje: 'Error al solicitar préstamo', error: error.message });
  }
};

// ADMIN: Aprobar préstamo
const aprobarPrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, {
      include: [{ model: Libro, as: 'libro' }]
    });
    if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    if (prestamo.estado !== 'pendiente') return res.status(400).json({ mensaje: 'Solo se pueden aprobar solicitudes pendientes' });
    if (prestamo.libro.cantidad < 1) return res.status(400).json({ mensaje: 'Sin stock disponible' });

    await prestamo.libro.update({ cantidad: prestamo.libro.cantidad - 1 });

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 14);

    await prestamo.update({ estado: 'prestado', fechaAprobacion: new Date(), fechaLimite });
    res.json({ mensaje: 'Préstamo aprobado', prestamo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al aprobar préstamo', error });
  }
};

// ADMIN: Registrar devolución
const registrarDevolucion = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, {
      include: [{ model: Libro, as: 'libro' }]
    });
    if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    if (prestamo.estado !== 'prestado') return res.status(400).json({ mensaje: 'Solo se pueden devolver libros prestados' });

    await prestamo.libro.update({ cantidad: prestamo.libro.cantidad + 1 });
    await prestamo.update({ estado: 'devuelto', fechaDevolucion: new Date() });
    res.json({ mensaje: 'Devolución registrada', prestamo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar devolución', error });
  }
};

// USUARIO: Ver mis préstamos
const misPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{ model: Libro, as: 'libro', attributes: ['id', 'titulo', 'autor'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos', error });
  }
};

// ADMIN: Ver todos los préstamos
const todosPrestamos = async (req, res) => {
  try {
    const { estado } = req.query;
    const prestamos = await Prestamo.findAll({
      where: estado ? { estado } : {},
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
        { model: Libro,   as: 'libro',   attributes: ['id', 'titulo', 'autor'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamos', error });
  }
};

// ADMIN: Ver préstamo por ID
const obtenerPrestamo = async (req, res) => {
  try {
    const prestamo = await Prestamo.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
        { model: Libro,   as: 'libro',   attributes: ['id', 'titulo', 'autor'] }
      ]
    });
    if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener préstamo', error });
  }
};

module.exports = {
  solicitarPrestamo, aprobarPrestamo, registrarDevolucion,
  misPrestamos, todosPrestamos, obtenerPrestamo
};
