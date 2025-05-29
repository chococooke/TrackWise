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

const getUserExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 0) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Expense.findAndCountAll({
      where: {
        UserId: req.params.id,
      },
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset: offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    });
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

module.exports = { addExpense, getUserExpenses, deleteExpense };
