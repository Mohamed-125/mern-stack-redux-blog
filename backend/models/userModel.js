const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: String,
    },
  ],
  bio: {
    type: String,
  },
  socialMedia: [
    {
      name: {
        type: String,
      },
      icon: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
});

userSchema.virtual("blogs", {
  ref: "blog",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("notifications", {
  ref: "notification",
  localField: "_id",
  foreignField: "targetUser",
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
