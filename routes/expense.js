const express = require("express");
const { isLoggedIn } = require("../middlewares/auth/loginMiddleware.js");

const {
  addExpense,
  getUserExpenses,
  deleteExpense,
  updateExpese,
} = require("../controllers/expense");
const router = express.Router();

router.post("/", isLoggedIn, addExpense);
router.get("/:id", isLoggedIn, getUserExpenses);
router.put("/update/:id", isLoggedIn, updateExpese);
router.delete("/delete/:id", isLoggedIn, deleteExpense);
module.exports = router;
