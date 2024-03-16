const { Router } = require("express");
const router = Router();

const {movimientoDeCajaMenor} = require("../controller/consultas.controller");


<<<<<<< HEAD
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const verificarTokenMiddleware = require("../middleware/userAuthentication");
=======
const validarTokenMiddleware = require('../middleware/userAuthentication');
>>>>>>> 784f66d1a3da5d4c71bdfb7c37648a6b0e48b184
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener los movimienos de caja
router.post("/obtenerMovimientoCaja", validarTokenMiddleware,checkRoleAuth(['SuperUsuario','Gerente', 'Administrador']),movimientoDeCajaMenor);
module.exports = router;
