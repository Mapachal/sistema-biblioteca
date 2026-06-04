const { Sequelize } = require("sequelize");

const conexion = new Sequelize(
    "biblioteca",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
);

module.exports = conexion;