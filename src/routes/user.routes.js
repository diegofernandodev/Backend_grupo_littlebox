const { Router } = require("express");
const router = Router();
const {
    guardarUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    eliminarUsuarioPorId,
    modificarUsuarioPorId,
} = require("../controller/user.controller");
const{resetPassword, restablecerPassword, logout} = require("../controller/login.controller")

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los usuarios
router.get("/obtenerTodosLosUsuarios", verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador']), obtenerUsuarios);

// Ruta para obtener un usuario por su ID
router.get("/obtenerUsuario/:id",verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador', 'colaborador']), obtenerUsuarioPorId);

// Ruta para modificar un usuario por su ID
router.put("/modificarUsuario",verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador', 'colaborador']), modificarUsuarioPorId);

// Ruta para eliminar un usuario por su ID
router.delete("/eliminarUsuario/:id",verificarTokenMiddleware, checkRoleAuth(['gerente']), eliminarUsuarioPorId);

// Ruta para guardar una nueva categoria
router.post("/guardarUsuario",verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador', 'colaborador']), guardarUsuario);


// Ruta para enviar correo de restablecer contraseña
router.post("/resetPassword",verificarTokenMiddleware, resetPassword);


// Ruta para restablecer la contraseña
router.put("/newPassword",verificarTokenMiddleware, restablecerPassword);

// Ruta para cerrar sesion
router.post("/logout",verificarTokenMiddleware, logout);


module.exports = router;
