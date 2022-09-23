const { Router } = require("express");
const { check } = require("express-validator");

const {
  createUser,
  registerProfile,
  activateProfile,
  getUser,
  getProfile,
  getUsersByRole,
  updateProfile,
  getProfilesByCareer,
} = require("../controllers/users.controller");
const { validateAdmin } = require("../middleware/data-validation.middleware");
const { validateFields } = require("../middleware/validate-fields.middleware");
const { validateJWT } = require("../middleware/jwt.middleware");

const router = Router();

router.post(
  "/create",
  [
    check("name", "Name required.").not().isEmpty(),
    check("username", "Username required.").not().isEmpty(),
    check(
      "password",
      "PASSWORD is required and must contain at least 6 characters"
    )
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    validateFields,
    // validateJWT,
    // validateAdmin,
  ],
  createUser
);

router.post(
  "/register_profile",
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
    check("carrera", "Carrera is required.").not().isEmpty(),
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

router.get("/profile/:control", getProfile);

router.get("/profiles/:carrera", getProfilesByCareer);

router.get("/:user", getUser);

router.get("/role/:role", getUsersByRole);

router.put(
  "/profile/:id",
  [check("id", "Id required.").not().isEmpty()],
  updateProfile
);

module.exports = router;
