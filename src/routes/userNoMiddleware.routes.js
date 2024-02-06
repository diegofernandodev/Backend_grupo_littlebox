const { Router } = require("express");
const router = Router();
const {
  guardarUsuario,
} = require("../controller/user.controller");
const { resetPassword, restablecerPassword, logout } = require("../controller/login.controller")

// const multitenancyMiddleware = require("../middleware/multitenancyMiddleware");
// const verificarTokenMiddleware = require('../middleware/validarTokenMiddleware');
// const checkRoleAuth = require('../middleware/roleAuth');

router.get("/", (req, res) => {
  res.send("LittleBox");
});



// Ruta para guardar una nuevo usuario
router.post("/guardarUsuario", guardarUsuario);




module.exports = router;
