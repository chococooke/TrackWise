const {
  isLoggedIn,
  isPremium,
} = require("../middlewares/auth/loginMiddleware.js");
const { getReport } = require("../controllers/report.js");
const router = require("express").Router();

router.post("/month/:id", isLoggedIn, isPremium, getReport);

module.exports = router;
