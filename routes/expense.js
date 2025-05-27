const express = require("express");
const {
  addExpense,
  getExpensesForUser,
  deleteExpense,
} = require("../controllers/expense");
const router = express.Router();

router.post("/", addExpense);
router.get("/:id", getExpensesForUser);
router.delete("/delete/:id", deleteExpense);
module.exports = router;
