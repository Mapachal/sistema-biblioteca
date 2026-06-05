const { DataTypes } = require('sequelize');
const crypto   = require('crypto');
const conexion = require('../config/database');
const Usuario  = require('./Usuario');
const Libro    = require('./Libro');

const Prestamo = conexion.define('Prestamo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigoPrestamo: {
    type: DataTypes.STRING(16),
    unique: true,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Usuario, key: 'id' }
  },
  libroId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Libro, key: 'id' }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'prestado', 'devuelto'),
    defaultValue: 'pendiente',
    allowNull: false
  },
  fechaSolicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fechaAprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaDevolucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fechaLimite: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'prestamos',
  timestamps: true,
  hooks: {
    beforeCreate: async (prestamo) => {
      try {
        // Genera código único de 16 caracteres con crypto
        prestamo.codigoPrestamo = crypto
          .randomBytes(8)
          .toString('hex')
          .toUpperCase();
      } catch (err) {
        console.error('Error en hook beforeCreate:', err);
        throw err;
      }
    }
  }
});

// Asociaciones
Prestamo.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
Prestamo.belongsTo(Libro,   { foreignKey: 'libroId',   as: 'libro'   });
Usuario.hasMany(Prestamo,   { foreignKey: 'usuarioId', as: 'prestamos' });
Libro.hasMany(Prestamo,     { foreignKey: 'libroId',   as: 'prestamos' });

module.exports = Prestamo;
