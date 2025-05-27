const { Expense } = require("../models/index.js");
const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ expense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
};

const getExpensesForUser = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        UserId: req.params.id,
      },
    });

    if (expenses.length !== 0) {
      res.status(200).json({ exp: expenses });
    } else {
      res.status(200).json({ exp: [] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: "expense deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { addExpense, getExpensesForUser, deleteExpense };
