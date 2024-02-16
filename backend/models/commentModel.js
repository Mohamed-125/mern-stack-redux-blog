const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
