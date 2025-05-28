const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbInit.js");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  premium: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  },
  sessionToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sessionExpires: {
    type: DataTypes.DATE,
  },
});

module.exports = User;
