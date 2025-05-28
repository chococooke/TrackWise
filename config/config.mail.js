require("dotenv").config();
const nodemailer = require("nodemailer");

const user = process.env.BREVO_USER;
const pass = process.env.BREVO_PASS;
const port = process.env.BREVO_PORT;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: port,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports = transporter;
