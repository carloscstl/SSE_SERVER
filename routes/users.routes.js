const { Router } = require("express");
const { check } = require("express-validator");

const {
  newUser,
  getUser,
  getProfile,
  getUsersByRole,
  updateProfile,
  registerProfile,
  activeProfile,
} = require("../controllers/users.controller");
const { validateAdmin } = require("../middleware/data-validation.middleware");
const { validateFields } = require("../middleware/validate-fields.middleware");
const { validateJWT } = require("../middleware/jwt.middleware");

const router = Router();

router.post(
  "/register",
  [
    check("name", "Name required.").not().isEmpty(),
    check("username", "Username required.").not().isEmpty(),
    check("password", "Password required.").not().isEmpty(),
    validateFields,
    // validateJWT,
    // validateAdmin,
  ],
  newUser
);

router.post("/activate", activeProfile);

router.post(
  "/register_profile",
  [check("username", "Username required.").not().isEmpty(), validateFields],
  registerProfile
);

router.get("/profile/:user", getProfile);

router.get("/:user", getUser);

router.get("/role/:role", getUsersByRole);

router.put(
  "/profile/:id",
  [check("id", "Id required.").not().isEmpty()],
  updateProfile
);

module.exports = router;
