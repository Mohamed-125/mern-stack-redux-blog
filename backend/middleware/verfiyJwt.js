const { verify, sign } = require("jsonwebtoken");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  generateToken,
} = require("../utils/jwt");

const verifyJwt = async (req, res, next) => {
  // get the token from the request
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  try {
    const accessTokenPayload = await verify(accessToken, accessTokenSecret);
    console.log("accessToken is there", accessTokenPayload);
    req.user = accessTokenPayload._id;
    next();
  } catch (err) {
    try {
      // check refresh token is there or not
      const refreshTokenPayload = await verify(
        refreshToken,
        refreshTokenSecret
      );

      // if the refresh token is ok generate new token

      const newAccessToken = await generateToken(
        { _id: refreshTokenPayload._id },
        accessTokenSecret,
        accessTokenExpiresIn
      );

      console.log(newAccessToken);
      // Set the new access token in the response cookie
      res.cookie("accessToken", newAccessToken, {
        maxAge: accessTokenExpiresIn,
        httpOnly: true,
      });

      // Set user information in the request object
      req.user = refreshTokenPayload._id;
      console.log("new accessToken is there");

      next();
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .send("there is no refresh Token you have to login in first");
    }
  }

  //   if (!accessToken) ;
};

module.exports = verifyJwt;
