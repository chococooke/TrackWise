const { User } = require("../models/index.js");
const { hash, compare } = require("bcrypt");

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send({ error: "Cannot process empty fields" });
    }

    const pwdHash = await hash(password, 10);

    const user = await User.create({ username, email, password: pwdHash });

    const currentUser = {
      id: user.id,
      username: username,
      email: email,
      premium: user.premium,
    };

    res.status(201).json({
      message: "Signed up successfully",
      user: currentUser,
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
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const match = await compare(password, user.password);
      if (match) {
        const currentUser = {
          id: user.id,
          username: user.username,
          email: email,
          premium: user.premium,
        };

        console.log(currentUser);

        return res
          .status(200)
          .json({ user: currentUser, message: "Login succesfull" });
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
