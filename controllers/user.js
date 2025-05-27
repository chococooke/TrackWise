const { User, Expense } = require("../models/index.js");

async function getleaderBoard(req, res) {
  try {
    let leaderboard = [];
    const users = await User.findAll({
      logging: false,
      attributes: ["username"],
      include: [{ model: Expense, attributes: ["amount"] }],
    });

    users.forEach((user) => {
      let totalExpense = 0;
      user.Expenses.forEach((exp) => {
        totalExpense += exp.dataValues.amount;
      });
      leaderboard.push({
        username: user.dataValues.username,
        exp: totalExpense,
      });
    });
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    return res.status();
  }
}
module.exports = { getleaderBoard };
