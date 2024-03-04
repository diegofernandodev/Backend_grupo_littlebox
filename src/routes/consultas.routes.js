const { Router } = require("express");
const router = Router();

const {movimientoDeCajaMenor} = require("../controller/consultas.controller");


// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener los movimienos de caja
router.get("/obtenerMovimientoCaja", verificarTokenMiddleware,checkRoleAuth(['SuperUsuario','Gerente', 'Administrador']),movimientoDeCajaMenor);

module.exports = router;
