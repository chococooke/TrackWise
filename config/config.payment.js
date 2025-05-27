require("dotenv").config();
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const CF_CLIENT_ID = process.env.CF_CLIENT_ID;
const CF_SECRET_KEY = process.env.CF_SECRET_KEY;

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  CF_CLIENT_ID,
  CF_SECRET_KEY
);

module.exports = cashfree;