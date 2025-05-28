const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../models/index.js");

async function createResetLink(email) {
  try {
    const resetToken = await crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const tokenExpiry = Date.now() + 3600000;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { error: "No user exists with this email" };
    }

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiry;

    const resetLink = `http://localhost:5000/auth/reset-password?token=${resetToken}&id=${user.id}`;

    await user.save();

    return { link: resetLink };
  } catch (err) {
    console.log(err);
  }
}

async function resetPassword(token, id, password) {
  console.log(token, id, password);
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    console.log(user);
    if (!user) {
      return { error: "Link not valid" };
    }

    if (user.resetPasswordExpires - Date.now() < 0) {
      return { error: "Link not valid" };
    }

    const match = await bcrypt.compare(token, user.resetPasswordToken);

    if (!match) {
      return { error: "Link not valid" };
    }

    user.password = bcrypt.hash(password, 10);
    user.resetPasswordToken = "null";
    user.resetPasswordExpires = Date.now();
    await user.save();

    return { sucess: "Password has been updated" };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
}

module.exports = { createResetLink, resetPassword };
