const express = require("express");
const verifyJwt = require("../middleware/verfiyJwt");
const userModel = require("../models/userModel");
const router = express.Router();

router.post("/:id", verifyJwt, async (req, res) => {
  const userId = req.user;
  const userNotification = await userModel
    .findOne({ _id: userId })
    .lean()
    .populate("notifications")
    .select("notifications");
  console.log(userNotification);
  res.send(userNotification);
});

module.exports = router;
