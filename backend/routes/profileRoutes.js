const express = require("express");
const verifyJwt = require("../middleware/verfiyJwt");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  try {
    const user = await userModel
      .findOne({ _id })
      .lean()
      .populate({
        path: "blogs",
      })
      .populate({
        path: "notifications",
      });
    console.log(user);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(404).send("no user found");
  }
});

router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const { email, username, bio, profileImg, follower, operation } = req.body;
  try {
    if (operation !== "unfollow") {
      const user = await userModel
        .findOneAndUpdate(
          { _id },
          { $push: { followers: follower }, email, username, bio, profileImg },
          { new: true }
        )
        .lean();

      res.send(user);
    } else {
      const user = await userModel
        .findOneAndUpdate(
          { _id },
          {
            $pull: { followers: follower },
          },
          { new: true }
        )
        .lean();

      res.send(user);
    }
  } catch (err) {
    console.log(err);
    res.status(404).send("no user found");
  }
});
module.exports = router;
