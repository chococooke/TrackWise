const router = require("express").Router();
const { signUp, logIn, resetPassword, initResetPassword } = require("../controllers/auth.js");

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/init-reset-password", initResetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
