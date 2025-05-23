const Expense = require("./Expense.js");
const User = require("./User.js");

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { User, Expense };
