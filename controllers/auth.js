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
