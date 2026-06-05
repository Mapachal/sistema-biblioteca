const express = require("express");
const router = express.Router();
const {
    crearUsuario,
    listarUsuarios, 
    buscarUsuario, 
    editarUsuario, 
    eliminarUsuario 
} = require("../controladores/usuarioControlador");

const verificarToken = require("../middlewares/verificarToken");
const verificarRol = require("../middlewares/verificarRol");

router.use(verificarToken);
router.use(verificarRol("admin"));

router.post("/", crearUsuario);
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", editarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;