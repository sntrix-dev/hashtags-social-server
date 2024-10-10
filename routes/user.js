const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

// Route to get all users
router.get("/", userController.getUsers);

// Route to get a current user
router.get("/profile", userController.getCurrentUser);

// Route to get a single user by ID
router.get("/:id", userController.getUserById);

// Route to update an existing user by ID
router.put("/profile", userController.updateUser);

// Route to add a follower
router.patch("/:id/follow/:action", userController.updateFollowers);

module.exports = router;
