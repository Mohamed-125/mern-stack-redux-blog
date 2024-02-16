const express = require("express");
const {
  generateToken,
  accessTokenSecret,
  accessTokenExpiresIn,
  refreshTokenSecret,
  refreshTokenExpiresIn,
} = require("../utils/jwt");

const router = express.Router();
const userModel = require("../models/userModel");
const verifyJwt = require("../middleware/verfiyJwt");

// register user route

router.post("/register", async (req, res) => {
  const { email, password, username, profileImg, bio } = req.body;
  if (!email || !password || !username)
    return res
      .status(400)
      .send("you have too send at least the email , password and username");

  const userExists = await userModel
    .findOne({ email })
    .lean()
    .populate("notifications");

  if (userExists) return res.status(400).send("user already exists");

  const user = await userModel.create({
    email,
    password,
    username,
    bio,
    profileImg,
  });

  // generate accessToken and send it as a cookie

  const accessToken = await generateToken(
    { _id: user._id },
    accessTokenSecret,
    accessTokenExpiresIn
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: accessTokenExpiresIn,
  });

  // generate refreshToken and send it as a cookie

  const refreshToken = await generateToken(
    { _id: user._id },
    refreshTokenSecret,
    refreshTokenExpiresIn
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiresIn,
  });

  res.status(201).send(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("email or password are not valid");

  const user = await userModel
    .findOne({ email })
    .lean()
    .populate("notifications");

  const isMatch = password === user?.password;
  if (!isMatch || !user)
    return res.status(400).send("email or password are not valid");

  // generate accessToken and send it as a cookie

  const accessToken = await generateToken(
    { _id: user._id },
    accessTokenSecret,
    accessTokenExpiresIn
  );

  console.log(accessToken);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: accessTokenExpiresIn,
  });

  // generate refreshToken and send it as a cookie

  const refreshToken = await generateToken(
    { _id: user._id },
    refreshTokenSecret,
    refreshTokenExpiresIn
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenExpiresIn,
  });

  res.status(200).send(user);
});

// logout route
router.post("/logout", async (req, res) => {
  res.cookie("accessToken", "", {
    maxAge: 0,
  });
  res.cookie("refreshToken", "", {
    maxAge: 0,
  });
  res.send("logged out");
  console.log("logout");
});
module.exports = router;
