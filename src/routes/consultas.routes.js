const { Router } = require("express");
const router = Router();

const {movimientoDeCajaMenor} = require("../controller/consultas.controller");


const validarTokenMiddleware = require('../middleware/userAuthentication');
const checkRoleAuth = require('../middleware/roleAuth');


router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener los movimienos de caja
router.post("/obtenerMovimientoCaja", validarTokenMiddleware,checkRoleAuth(['SuperUsuario','Gerente', 'Administrador']),movimientoDeCajaMenor);
module.exports = router;
