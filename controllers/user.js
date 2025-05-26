const { User, Expense } = require("../models/index.js");

const getleaderBoard = async (req, res) => {
  const leaderboard = [];
  try {
    const users = await User.findAll({
      limit: 15,
    });

    if (users.length === 0) {
      return res.status(200).json({});
    }

    for (const user of users) {
      try {
        const expenses = await Expense.findAll({
          where: {
            UserId: user.id,
          },
        });

        const totalExpense = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        leaderboard.push({ username: user.username, exp: totalExpense });
      } catch (err) {
        console.error(
          `Error processing expenses for user ${user.username}:`,
          err
        );
        leaderboard[user.username] = 0; // Default to 0 for failed users
      }
    }

    return res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getleaderBoard };
