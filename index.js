const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.js");
const sequelize = require("./config/dbInit.js");

(async() => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
    } catch(err){
        console.log(err);
        return;
    }
})();

const app = express();

app.use(express.json());
app.use(cors({}));
app.use('/api/auth', authRouter);

app.use(express.static("public"));

app.get("/api/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.listen(3000, () => console.log("Server started on port 3000"));
