const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.js");
const expenseRouter = require("./routes/expense.js");
const userRouter = require("./routes/user.js");
const sequelize = require("./config/dbInit.js");
const dotenv = require("dotenv");

dotenv.config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("[+] MySQL connected");
  } catch (err) {
    return;
  }
})();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/api/auth", authRouter);
app.use("/exp", expenseRouter);
app.use("/users", userRouter);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public");
});

app.get("/app", (req, res) => {
  res.sendFile(__dirname + "/public/app.html");
});

app.get("/auth/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/auth/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.listen(process.env.PORT || 5000, () =>
  console.log("[+] Server started: http://localhost:5000")
);
