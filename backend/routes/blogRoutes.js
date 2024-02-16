const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel");
const verifyJwt = require("../middleware/verfiyJwt");
const userModel = require("../models/userModel");
const notificationModel = require("../models/notificationsModel");

// get all blogs
router.get("", async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    res.send(blogs);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// get certain blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await blogModel
      .findOne({ _id: req.params.id })
      .lean()
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "user",
        },
      })
      .populate({
        path: "user",
        model: "user",
      });

    res.send(blog);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// create new blog
router.post("/new", verifyJwt, async (req, res) => {
  const { title, data, description, bannerImg, isDraft } = req.body;
  if (!title || !data || !description || !bannerImg || isDraft === undefined)
    return res.status(400).send("you have to send all blog content");

  console.log("user", req.user);
  const createdBlog = await blogModel.create({
    title,
    description,
    bannerImg,
    isDraft,
    data,
    user: req.user,
  });

  const user = await userModel.findOne({ _id: req.user });

  await Promise.all(
    user.followers.map(async (follower) => {
      const notification = await notificationModel.create({
        user: req.user,
        targetUser: follower,
        typeData: {
          type: "new blog",
          blogId: createdBlog._id,
        },
      });
      console.log(notification);
    })
  );

  res.status(201).send(createdBlog);
});

// update certain blog
router.put("/:id", verifyJwt, async (req, res) => {
  const { title, data, description, bannerImg, isDraft } = req.body;

  try {
    const blog = await blogModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        data,
        isDraft,
        description,
        bannerImg,
      },
      {
        new: true,
      }
    );
    res.send(blog);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// delete certain blog

router.delete("/:id", verifyJwt, async (req, res) => {
  try {
    const blog = await blogModel.findOneAndDelete({ _id: req.params.id });
    res.status(200).send("deleted succefuly");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
