const express = require("express");
const { addExpense, getExpensesForUser } = require("../controllers/expense");
const router = express.Router();

router.post("/", addExpense);
router.get("/:id", getExpensesForUser);

module.exports = router;
