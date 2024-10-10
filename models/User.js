const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    asset_id: String,
    public_id: String,
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
    bytes: Number,
    url: String,
    asset_folder: String,
  },
  bio: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  favTags: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
