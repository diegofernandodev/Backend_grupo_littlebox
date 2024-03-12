const { Router } = require("express");
const router = Router();
const {
    obtenerIngresoPorId,
    obtenerIngresos,
    modificarIngresoPorId,
    eliminarIngresoPorId,
    guardarIngreso,
} = require("../controller/ingresos.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
    res.send("LittleBox");
});

// Ruta para obtener todos los ingresos
router.get("/obtenerTodosLosIngresos", verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador']), obtenerIngresos);

// Ruta para obtener un ingreso por su ID
router.get("/obtenerIngreso/:id", verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador']), obtenerIngresoPorId);

// Ruta para modificar un ingreso por su ID
router.put("/modificarIngreso/:id", verificarTokenMiddleware, checkRoleAuth(['gerente', 'administrador']), modificarIngresoPorId);

// Ruta para eliminar un ingreso por su ID
router.delete("/eliminarIngreso/:id", verificarTokenMiddleware, checkRoleAuth(['gerente']), eliminarIngresoPorId);

// Ruta para guardar un nuevo ingreso
router.post("/guardarIngreso", verificarTokenMiddleware, checkRoleAuth(['gerente']), guardarIngreso);

module.exports = router;