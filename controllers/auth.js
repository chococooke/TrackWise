const User = require("../models/User.js");

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send({ error: "Cannot process empty fields" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "Signed up successfully",
      user,
    });
  } catch (error) {
    if ((error.name = "SequelizeUniqueConstraintError"))
      return res.json({ error: "User already exists" });
    return res.send({ error: "Something went wrong" });
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      if (user.password === password) {
        return res.status(200).json({ user, message: "Login succesfull" });
      } else {
        return res.status(403).json({ error: "wrong credentials" });
        
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "Internal server error" });
  }
};
