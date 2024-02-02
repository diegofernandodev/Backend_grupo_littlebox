const { Router } = require("express");
const router = Router();
const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  guardarEmpresa,
  eliminarEmpresaPorId,
  modificarEmpresaPorId,
} = require("../controller/empresas.controller");

const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las empresas
router.get("/obtenerTodasLasEmpresas", verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']),obtenerEmpresas);

// Ruta para obtener una empresa por su ID
router.get("/obtenerEmpresa/:id", verificarTokenMiddleware,checkRoleAuth(['gerente', 'administrador', 'colaborador']),obtenerEmpresaPorId);

// Ruta para modificar una empresa por su ID
router.put("/modificarEmpresa/:id", verificarTokenMiddleware,checkRoleAuth(['gerente']), modificarEmpresaPorId);

// Ruta para eliminar una empresa por su ID
router.delete("/eliminarEmpresa/:id", verificarTokenMiddleware,checkRoleAuth(['gerente']), eliminarEmpresaPorId);

// Ruta para guardar una empresa por su ID
router.post("/guardarEmpresa", verificarTokenMiddleware,checkRoleAuth(['gerente']), guardarEmpresa);

module.exports = router;
