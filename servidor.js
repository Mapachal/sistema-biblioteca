const express = require("express");
const conexion = require("./configuracion/baseDatos");
const Usuario = require("./modelos/usuario");
const autenticacionRutas = require("./rutas/autenticacionRutas");
const verificarToken = require("./middlewares/verificarToken");
const usuarioRutas = require("./rutas/usuarioRutas");

const app = express();

app.use(express.json());
app.use("/auth", autenticacionRutas);
app.use("/usuarios", usuarioRutas);

app.get(
    "/perfil",
    verificarToken,
    (req, res) => {
        res.json({
            mensaje: "Ruta protegida",
            usuario: req.usuario
        });
    }
);

conexion.authenticate()
.then(() => {
    console.log(
        "Conexión exitosa"
    );
    return conexion.sync();
})
.then(() => {
    console.log(
        "Tablas creadas"
    );
})
.catch(error => {
    console.log(error);
});

app.listen(3000, () => {
    console.log(
        "Servidor iniciado"
    );
});