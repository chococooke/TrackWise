const { getleaderBoard } = require("../controllers/user.js");
const {
  isLoggedIn,
  isPremium,
} = require("../middlewares/auth/loginMiddleware.js");
const router = require("express").Router();

router.get("/leaderboard", isLoggedIn, isPremium, getleaderBoard);

module.exports = router;
