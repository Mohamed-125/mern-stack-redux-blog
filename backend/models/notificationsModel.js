const mongoose = require("mongoose");
const userModel = require("./userModel");

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  targetUser: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  typeData: {
    type: {
      type: "string",
      required: true,
    },
    blogId: {
      type: mongoose.Types.ObjectId,
      ref: "blog",
    },
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
  },
  content: {
    text: {
      type: "string",
    },
    blogId: {
      type: mongoose.Types.ObjectId,
      ref: "blog",
    },
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
  },
});

notificationSchema.pre("save", async function () {
  console.log(this.targetUser);
  const foundedUser = await userModel
    .findOne({ _id: this.targetUser })
    .lean()
    .select("username");
  console.log(foundedUser);
  const { username } = foundedUser;

  switch (this.typeData.type) {
    case "reply":
      this.content = {
        text: `${username} has replied to your comments`,
        blogId: this.typeData.blogId,
        commentId: this.typeData.commentId,
      };
      break;

    case "new blog":
      this.content = {
        text: `${username} has created a new blog `,
        blogId: this.typeData.blogId,
        commentId: this.typeData.commentId,
      };
      break;
  }
});

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;
