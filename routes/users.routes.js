const { Router } = require("express");
const { check } = require("express-validator");

const { createUser, getUser, getUsersByRole } = require("../controllers/users.controller");
const { validateFields } = require("../middleware/validate-fields.middleware");
// const { validateAdmin } = require("../middleware/data-validation.middleware");
// const { validateJWT } = require("../middleware/jwt.middleware");

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

router.get("/:user", getUser);

router.get("/role/:role", getUsersByRole);

module.exports = router;
