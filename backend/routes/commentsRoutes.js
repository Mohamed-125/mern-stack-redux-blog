const express = require("express");
const verifyJwt = require("../middleware/verfiyJwt");
const commentModel = require("../models/commentModel");
const router = express.Router();

router.post("/new", verifyJwt, async (req, res) => {
  const user = req.user;
  const blog = req.body.blog;
  const text = req.body.text;
  console.log("user", user);
  if (!user || !blog || !text)
    return res.send("you must send all comment content");
  try {
    const createdComment = await commentModel.create({
      user,
      blog,
      text,
    });

    const createdCommentWithUserData = await createdComment.populate("user");
    res.send(createdCommentWithUserData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.put("/:id", verifyJwt, async (req, res) => {
  const likes = req.body.likes;
  const text = req.body.text;
  const _id = req.params.id;

  try {
    const comment = await commentModel.findOneAndUpdate(
      { _id },
      {
        likes,
        text,
      },
      { new: true }
    );

    res.send(comment);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
