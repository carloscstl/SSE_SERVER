const { Router } = require("express");
const { check } = require("express-validator");
const { login, renewToken } = require("../controllers/auth.controller");
const { validateJWT } = require("../middleware/jwt.middleware");
const { validateFields } = require("../middleware/validate-fields.middleware");
//const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt.middleware');

const router = Router();

router.post(
  "/login",
  [
    check("username", "El username es requerido.").not().isEmpty(),
    check("password", "El password es requerido.").not().isEmpty(),
    validateFields,
  ],
  login
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
