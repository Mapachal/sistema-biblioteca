const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: "No autenticado" });
        }
        if (!rolesPermitidos.includes(req.usuario.col)) {
            return res.status(403).json({ mensaje: "Acceso denegado: No tienes los permisos necesarios" });
        }

        next();
    };
};

module.exports = verificarRol;