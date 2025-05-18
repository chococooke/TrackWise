const router = require("express").Router();
const { signUp } = require("../controllers/auth.js");

router.post("/signup", signUp);

module.exports = router;