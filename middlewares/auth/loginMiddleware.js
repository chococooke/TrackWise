const { verify } = require("../../utils/jwt.js");
const { User } = require("../../models/index.js");

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await verify(token);

    const user = await User.findOne({
      attributes: ["email", "premium"],
      where: {
        email: decodedToken.data.email,
      },
    });

    if (!user) {
      return res.status("user not found!");
    }

    req.user = {
      email: user.email,
      premium: user.premium,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", message: error });
  }
};

module.exports.isPremium = async (req, res, next) => {
  try {
    if (req.user.premium) {
      next();
    } else {
      res.status(403).json({ error: "not authorized" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error });
  }
};
