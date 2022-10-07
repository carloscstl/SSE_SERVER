const { Router } = require("express");
const { check } = require("express-validator");

const {
  registerProfile,
  activateProfile,
  getProfile,
  getProfilesByCareer,
  updateProfile,
  updateLocation,
} = require("../controllers/profile.controller");

const { validateFields } = require("../middleware/validate-fields.middleware");

const router = Router();

router.post(
  "/register",
  [
    check("username", "Username is required.")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 8 }),
    check("nombre", "Nombre is required.").not().isEmpty(),
    check("apellido_Paterno", "Apellido Paterno is required.").not().isEmpty(),
    check("apellido_Materno", "Apellido Materno is required.").not().isEmpty(),
    check("sexo", "Sexo is required.").not().isEmpty(),
    check("fecha_nacimiento", "Fecha de Nacimiento is required.")
      .not()
      .isEmpty(),
    check("codigo_carrera", "Codigo_Carrera is required.").not().isEmpty(),
    validateFields,
  ],
  registerProfile
);

router.post(
  "/activate",
  [
    check("username", "Username is Required").not().isEmpty(),
    check(
      "password",
      "PASSWORD is required and must contain at least 6 characters"
    )
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    check("apellido_Paterno", "Apellido is Required"),
    validateFields,
  ],
  activateProfile
);

router.get("/:control", getProfile);

router.get("/career/:codigo_carrera", getProfilesByCareer);

router.patch("/:username", updateProfile);

// router.patch("/location/:username",[
//   check('lat','Latitud is required').not().isEmpty(),
//   check('lng','Longitud is required').not().isEmpty(),
//   check('color','Color is required').not().isEmpty(),
// ], updateLocation);

module.exports = router;
