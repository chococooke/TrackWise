const express = require("express");
const { isLoggedIn } = require("../middlewares/auth/loginMiddleware.js");

const {
  addExpense,
  getExpensesForUser,
  deleteExpense,
} = require("../controllers/expense");
const router = express.Router();

router.post("/", isLoggedIn, addExpense);
router.get("/:id", isLoggedIn, getExpensesForUser);
router.delete("/delete/:id", isLoggedIn, deleteExpense);
module.exports = router;
