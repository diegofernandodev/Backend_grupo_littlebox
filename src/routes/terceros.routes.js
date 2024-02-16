const { Router } = require("express");
const router = Router();
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../controller/terceros.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los terceros
router.get(
  "/obtenerTodosLosTerceros",
  verificarTokenMiddleware,
  checkRoleAuth(["Gerente", "Administrador", "Colaborador"]),
  obtenerTerceros,
);

// Ruta para obtener un tercero por su ID
router.get(
  "/obtenerTercero/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador", "colaborador"]),
  obtenerTerceroPorId,
);

// Ruta para modificar un tercero por su ID
router.put(
  "/modificarTercero/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador", "colaborador"]),
  modificarTerceroPorId,
);

// Ruta para eliminar un tercero por su ID
router.delete(
  "/eliminarTercero/:id",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador"]),
  eliminarTerceroPorId,
);

// Ruta para guardar un nuevo egreso
router.post(
  "/guardarTercero",
  verificarTokenMiddleware,
  checkRoleAuth(["gerente", "administrador", "colaborador"]),
  guardarTercero,
);

module.exports = router;
