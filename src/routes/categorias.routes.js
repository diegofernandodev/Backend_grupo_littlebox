const { Router } = require("express");
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoriaId,
    guardarCategoria,
    eliminarCategoriaId,
    modificarCategoriaPorId,
} = require("../controller/categorias.controller");

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const validarTokenMiddleware = require('../middleware/userAuthentication')

const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las categorias
router.get("/obtenerTodasLasCategorias", validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), guardarCategoria);

module.exports = router;
