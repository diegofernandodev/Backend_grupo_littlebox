const { Router } = require("express");
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoriaId,
    guardarCategoria,
    eliminarCategoriaId,
    modificarCategoriaPorId,
} = require("../controller/categorias.controller");

<<<<<<< HEAD
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const verificarTokenMiddleware = require("../middleware/userAuthentication");
=======
// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const validarTokenMiddleware = require('../middleware/userAuthentication')

>>>>>>> 784f66d1a3da5d4c71bdfb7c37648a6b0e48b184
const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener todas las categorias
<<<<<<< HEAD
router.get("/obtenerTodasLasCategorias", verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",verificarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), guardarCategoria);
=======
router.get("/obtenerTodasLasCategorias", validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategorias);

// Ruta para obtener una categoria por su ID
router.get("/obtenerCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador', 'Colaborador']), obtenerCategoriaId);

// Ruta para modificar una categoria por su ID
router.put("/modificarCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), modificarCategoriaPorId);

// Ruta para eliminar una categoria por su ID
router.delete("/eliminarCategoria/:id",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), eliminarCategoriaId);

// Ruta para guardar una nueva categoria
router.post("/guardarCategoria",validarTokenMiddleware,checkRoleAuth(['Gerente', 'Administrador']), guardarCategoria);
>>>>>>> 784f66d1a3da5d4c71bdfb7c37648a6b0e48b184

module.exports = router;
