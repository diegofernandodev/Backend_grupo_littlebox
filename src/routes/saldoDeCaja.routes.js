const { Router } = require("express");
const router = Router();
const {
    actualizarSaldoCaja
} = require("../controller/saldoDeCaja.controller");


// const verificarTokenMiddleware = require("../middleware/validarTokenMiddleware");
const verificarTokenMiddleware = require("../middleware/userAuthentication");
const checkRoleAuth = require("../middleware/roleAuth");

router.get("/", (req, res) => {
  res.send("LittleBox");
});

// Ruta para obtener el saldo de caja
router.get(
    "/obtenerSaldoDeCaja",
    verificarTokenMiddleware,
    checkRoleAuth(["Gerente", "Administrador","Colaborador"]),
    actualizarSaldoCaja,
  );

  module.exports = router;