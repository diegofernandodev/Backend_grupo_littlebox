const { Router } = require("express");
const router = Router();
const {
  obtenerTerceros,
  obtenerTerceroPorId,
  guardarTercero,
  eliminarTerceroPorId,
  modificarTerceroPorId,
} = require("../controller/terceros.controller");

<<<<<<< HEAD

// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");
=======
// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
const validarTokenMiddleware = require('../middleware/userAuthentication')
const checkRol = require("../middleware/roleAuth");
>>>>>>> 784f66d1a3da5d4c71bdfb7c37648a6b0e48b184

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todos los terceros
router.get(
  "/obtenerTodosLosTerceros",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  obtenerTerceros,
);

// Ruta para obtener un tercero por su ID
router.get(
  "/obtenerTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  obtenerTerceroPorId,
);

// Ruta para modificar un tercero por su ID
router.put(
  "/modificarTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador", "Colaborador"]),
  modificarTerceroPorId,
);

// Ruta para eliminar un tercero por su ID
router.delete(
  "/eliminarTercero/:id",
  validarTokenMiddleware,
  checkRol(["Gerente", "Administrador"]),
  eliminarTerceroPorId,
);

// Ruta para guardar un nuevo egreso
router.post(
  "/guardarTercero",
  validarTokenMiddleware , checkRol(['Gerente','Administrador']),
  guardarTercero
);

module.exports = router;
