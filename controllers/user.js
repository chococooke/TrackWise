const { User, Expense } = require("../models/index.js");
const { Sequelize } = require("sequelize");

const getleaderBoard = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    const offset = (pageNum - 1) * limitNum;

    const leaderboardData = await Expense.findAll({
      attributes: [
        [Sequelize.col("User.username"), "username"],
        [Sequelize.fn("SUM", Sequelize.col("Expense.amount")), "exp"],
      ],
      include: [{ model: User, attributes: [], required: false }],
      group: ["User.id", "User.username"],
      order: [[Sequelize.literal("exp"), "DESC"]],
      limit: limitNum,
      offset: offset,
      raw: true,
    });

    const totalCount = await User.count();

    const leaderboard = leaderboardData.map(({ username, exp }) => ({
      username,
      exp: Number(exp) || 0,
    }));

    res.json({
      success: true,
      data: leaderboard,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getleaderBoard };
