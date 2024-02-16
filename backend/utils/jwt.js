const jwt = require("jsonwebtoken");

const generateToken = async (payload, secert, expiresIn) => {
  try {
    const token = await jwt.sign(payload, secert, {
      expiresIn,
    });
    return token;
  } catch (err) {
    return err;
  }
};

const accessTokenExpiresIn = 900000; // 15 minute
const refreshTokenExpiresIn = 3.156e10; // 1 year
const accessTokenSecret = "accessTokenSecret";
const refreshTokenSecret = "refreshTokenSecret";

module.exports = {
  generateToken,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  accessTokenSecret,
  refreshTokenSecret,
};
