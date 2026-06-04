const { DataTypes } = require("sequelize");
const conexion = require("../configuracion/baseDatos");

const Usuario = conexion.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },

    rol: {
        type: DataTypes.ENUM("admin", "usuario"),
        defaultValue: "usuario"
    }
});

module.exports = Usuario;