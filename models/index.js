const sequelize = require("../config/dbInit.js");
const Expense = require("./Expense.js");
const User = require("./User.js");

User.hasMany(Expense);
Expense.belongsTo(User);

(async () => {
    try{
        await sequelize.sync();
    } catch(err){
        console.log(err);
    }
})

module.exports = { User, Expense };
