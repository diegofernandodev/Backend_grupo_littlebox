const { Router } = require("express");
const router = Router();
const {
  obtenerEgresoPorId,
  obtenerEgresos,
  modificarEgresoPorId,
  eliminarEgresoPorId,
  guardarEgreso,
} = require("../controller/egresos.controller");


// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los egresos
router.get(
  "/obtenerTodosLosEgresos",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  obtenerEgresos,
);

// Ruta para obtener un egreso por su ID
router.get(
  "/obtenerEgreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "administrador"]),
  obtenerEgresoPorId,
);

// Ruta para modificar un egreso por su ID
router.put(
  "/modificarEgreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador"]),
  modificarEgresoPorId,
);

// Ruta para eliminar un egreso por su ID
router.delete(
  "/eliminarEgreso/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente"]),
  eliminarEgresoPorId,
);

// Ruta para guardar un nuevo egreso
router.post(
  "/guardarEgreso",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador"]),
  guardarEgreso,
);

module.exports = router;
