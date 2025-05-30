const express = require("express");
const fs = require("fs");
const cors = require("cors");
const authRouter = require("./routes/auth.js");
const expenseRouter = require("./routes/expense.js");
const userRouter = require("./routes/user.js");
const paymentRouter = require("./routes/payment.js");
const reportRouter = require("./routes/report.js");
const sequelize = require("./config/dbInit.js");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("[+] MySQL connected");
  } catch (err) {
    console.log(err);
    return;
  }
})();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/auth", authRouter);
app.use("/exp", expenseRouter);
app.use("/users", userRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/report", reportRouter);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public`);
});

app.get("/app", (req, res) => {
  res.sendFile(`${__dirname}/public/app.html`);
});

app.get("/auth/signup", (req, res) => {
  res.sendFile(`${__dirname}/public/signup.html`);
});

app.get("/auth/login", (req, res) => {
  res.sendFile(`${__dirname}/public/login.html`);
});

app.get("/app/report", (req, res) => {
  res.sendFile(`${__dirname}/public/report.html`);
});

app.get("/app/download-report", (req, res) => {
  res.sendFile(`${__dirname}/public/report-download.html`);
});

app.get("/auth/init-reset-password", (req, res) => {
  res.sendFile(`${__dirname}/public/init-reset-password.html`);
});

app.get("/auth/reset-password", (req, res) => {
  res.sendFile(`${__dirname}/public/reset-password.html`);
});

app.get("/payment-status", (req, res) => {
  res.sendFile(`${__dirname}/public/payment-status.html`);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("[+] Server started: http://localhost:5000")
);
