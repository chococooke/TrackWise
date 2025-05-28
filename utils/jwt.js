const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

/**
 *
 * @param {Object} payload
 * @returns {Object}
 * @example
 * const data = await sign({id, username, Date.now()});
 */
module.exports.sign = async (payload) => {
  try {
    if (!payload) {
      return { error: "Payload not given" };
    }
    const token = await jwt.sign(payload, jwt_secret);
    return { token };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

module.exports.verify = async (token) => {
  try {
    if (!token) {
      return error("Token not given");
    }
    const data = await jwt.verify(token, jwt_secret);
    return { data };
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};
