const { User } = require("../models/index.js");
const { hash, compare } = require("bcrypt");
const transporter = require("../config/config.mail.js");
const { createResetLink, resetPassword } = require("../utils/reset-pass.js");
const { sign } = require("../utils/jwt.js");

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send({ error: "Cannot process empty fields" });
    }

    const pwdHash = await hash(password, 10);

    const jwTokenData = await sign({
      username,
      email,
      time: Date.now(),
    });

    if (jwTokenData.error) {
      return res.json({ error: "Something went wrong" });
    }

    const user = await User.create({
      username,
      email,
      password: pwdHash,
      sessionToken: jwTokenData.token,
      sessionTokenExpires: Date.now() + 259200000,
    });

    const currentUser = {
      id: user.id,
      username: username,
      email: email,
      premium: user.premium,
      twToken: user.sessionToken,
    };

    res.status(201).json({
      message: "Signed up successfully",
      user: currentUser,
    });
  } catch (error) {
    console.log(error);
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
          twToken: user.sessionToken,
        };

        res.status(201).json({
          message: "Signed up successfully",
          user: currentUser,
        });
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

module.exports.initResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetLink = await createResetLink(email);
    if (resetLink.error) {
      console.log(error);
      res.status(404).json(resetLink);
    }

    const mailOptions = {
      from: "pro.bhimsen@gmail.com",
      subject: "Link for resetting your TrackWise account password",
      to: email,
      text: `Link for resetting you TrackWise password`,
      html: `<p>follow <a href="${resetLink.link}">this link</a>to reset your password</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.send("A mail has been sent");
  } catch (err) {
    console.log(err);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token, id, password } = req.body;

    const result = await resetPassword(token, id, password);

    if (result.error) {
      return res.status(403).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};
