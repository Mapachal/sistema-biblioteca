const Libro = require('../modelos/Libro');

// Crear nuevo libro
exports.crearLibro = async (req, res) => {
  try {
    const { titulo, autor, categoria, cantidad } = req.body;
    const libro = await Libro.create({ titulo, autor, categoria, cantidad });
    res.status(201).json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos los libros
exports.obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.findAll();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar libro por ID
exports.obtenerLibroPorId = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar libro
exports.actualizarLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    const { titulo, autor, categoria, cantidad } = req.body;
    await libro.update({ titulo, autor, categoria, cantidad });

    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar libro
exports.eliminarLibro = async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    await libro.destroy();
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar libro por título
exports.buscarLibroPorTitulo = async (req, res) => {
  try {
    const { titulo } = req.query;
    const libros = await Libro.findAll({
      where: {
        titulo: {
          [require('sequelize').Op.like]: `%${titulo}%`
        }
      }
    });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
