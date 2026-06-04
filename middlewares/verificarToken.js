const jwt = require("jsonwebtoken");

const verificarToken =
(req, res, next) => {

    const token =
    req.header("Authorization");

    if (!token) {

        return res.status(401).json({
            mensaje: "Acceso denegado"
        });

    }

    try {

        const verificado =
        jwt.verify(
            token,
            "biblioteca2026"
        );

        req.usuario = verificado;

        next();

    } catch (error) {

        res.status(400).json({
            mensaje: "Token inválido"
        });

    }

};

module.exports = verificarToken;