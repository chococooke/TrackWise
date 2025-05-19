const router = require("express").Router();
const { signUp, logIn } = require("../controllers/auth.js");

router.post("/signup", signUp);
router.post("/login", logIn);

module.exports = router;