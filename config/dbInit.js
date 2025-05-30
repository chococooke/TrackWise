const { Sequelize } = require("sequelize");
const { config } = require("dotenv");

config();

const sequelize = new Sequelize(
  "trackwise",
  process.env.SQL_UN,
  process.env.SQL_PWD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

async () => {
  try {
    await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
};

module.exports = sequelize;
