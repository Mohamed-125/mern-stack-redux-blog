const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

    bannerImg: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isDraft: {
      type: Boolean,
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

blogSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "blog",
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
