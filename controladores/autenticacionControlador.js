const Usuario = require("../modelos/usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrar = async (req, res) => {

    try {

        const { nombre, correo, contraseña } = req.body;

        const existe = await Usuario.findOne({
            where: { correo }
        });

        if (existe) {
            return res.status(400).json({
                mensaje: "El correo ya existe"
            });
        }

        const contraseñaEncriptada =
            await bcrypt.hash(contraseña, 10);

        const usuario =
            await Usuario.create({
                nombre,
                correo,
                contraseña: contraseñaEncriptada
            });

        res.status(201).json({
            mensaje: "Usuario registrado",
            usuario
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

const iniciarSesion = async (req, res) => {

    try {

        const { correo, contraseña } = req.body;

        const usuario = await Usuario.findOne({
            where: { correo }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const valida =
            await bcrypt.compare(
                contraseña,
                usuario.contraseña
            );

        if (!valida) {

            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });

        }

        const token = jwt.sign(
            {
                id: usuario.id,
                rol: usuario.rol
            },
            "biblioteca2026",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            mensaje: "Login correcto",
            token
        });

    } catch (error) {

        res.status(500).json(error);

    }

};

module.exports = {
    registrar,
    iniciarSesion
};