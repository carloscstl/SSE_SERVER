const { Router } = require("express");
const { check } = require("express-validator");
const { registerCareer, getCareers } = require("../controllers/careers.controller");
const { validateFields } = require("../middleware/validate-fields.middleware");
const router = Router();

router.post(
  "/register",
  [
    check("carrera", "Carrera is required").not().isEmpty(),
    check("codigo_carrera", "codigo_carrera is required").not().isEmpty(),
    validateFields,
  ],
  registerCareer
);

router.get('/',getCareers);

module.exports = router;
