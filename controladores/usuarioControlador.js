const Usuario = require("../modelos/usuario");
const bcrypt = require("bcrypt");

const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, contraseña, rol } = req.body;
        const existe = await Usuario.findOne({ where: { correo } });
        if (existe) {
            return res.status(400).json({ 
                mensaje: "El correo ya está registrado por otro usuario" 
            });
        }
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);
        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            contraseña: contraseñaEncriptada,
            rol: rol || "usuario"
        });
        const respuestaUsuario = { ...nuevoUsuario.toJSON() };
        delete respuestaUsuario.contraseña;
        res.status(201).json({ 
            mensaje: "Usuario creado exitosamente por el administrador", 
            usuario: respuestaUsuario 
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el usuario", error });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contraseña'] }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios", error });
    }
};

const buscarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['contraseña'] }
        });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar usuario", error });
    }
};

const editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, rol } = req.body;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        usuario.nombre = nombre || usuario.nombre;
        usuario.correo = correo || usuario.correo;
        usuario.rol = rol || usuario.rol;
        await usuario.save();
        res.json({ mensaje: "Usuario actualizado con éxito", usuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario", error });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        await usuario.destroy();
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario", error });
    }
};

module.exports = {
    crearUsuario,
    listarUsuarios,
    buscarUsuario,
    editarUsuario,
    eliminarUsuario
};