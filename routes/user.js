const { getleaderBoard } = require("../controllers/user.js");
const router = require("express").Router();

router.get("/leaderboard", getleaderBoard);

module.exports = router;