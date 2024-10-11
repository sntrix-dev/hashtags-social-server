const uploadImageToCloudinary = require("../lib/cloudinary");
const User = require("../models/User"); // Assuming you have a User model defined
const jwt = require("jsonwebtoken");
const sanitizer = require("../lib/sanitizer");
const formidable = require("formidable");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const sanitizedUsers = users.map((user) => sanitizer.user(user));
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getCurrentUser = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Assuming you use JWT and have a secret key
    const userId = decodedToken.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(sanitizer.user(user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(sanitizer.user(user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const uploadAvatar = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error parsing form data", error: err });
    }

    const token = req.headers.authorization;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle file upload if a file is provided
      if (files.profileImage) {
        const imagePath = files.profileImage[0].filepath;

        const avatar = await uploadImageToCloudinary(
          imagePath,
          !!user.avatar && {
            public_id: user.avatar.public_id,
            overwrite: true,
            invalidate: true,
            folder: "avatars",
          }
        );
        user.avatar = avatar;
      } else {
        return res.status(400).json({ message: "No image file provided" });
      }

      await user.save();
      res.status(200).json(sanitizer.user(user).avatar);
    } catch (error) {
      res.status(500).json({ message: "Error updating avatar", error });
    }
  });
};

const updateUser = async (req, res) => {
  const token = req.headers.authorization;
  const updatedData = req.body;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(sanitizer.user(user));
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const updateFollowers = async (req, res) => {
  const token = req.headers.authorization;
  const followerId = req.params.id;
  const action = req.params.action; // 'add' or 'remove'

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "add") {
      if (!user.followers.includes(followerId)) {
        user.followers.push(followerId);
      }
    } else if (action === "remove") {
      const followerIndex = user.followers.indexOf(followerId);
      if (followerIndex !== -1) {
        user.followers.splice(followerIndex, 1);
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.status(200).json(sanitizer.user(user));
  } catch (error) {
    res.status(500).json({ message: "Error updating followers", error });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateFollowers,
  uploadAvatar,
};
