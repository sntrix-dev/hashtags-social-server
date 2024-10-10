const express = require("express");
const postController = require("../controllers/posts");

const router = express.Router();

// Route to get all posts by user
router.get("/", postController.getAllPostsByUser);
// Route to get posts by multiple tags
router.get("/tags", postController.getPostsByTags);

// Route to get posts by multiple users
router.get("/users", postController.getPostsByUserIds);

// Route to create a new post
router.post("/", postController.createPost);

// Route to get a specific post by ID
router.get("/:id", postController.getPostById);

// Route to delete a post by ID
router.delete("/:id", postController.deletePost);

// Route to add a comment to a post
router.post("/:id/comments", postController.addCommentToPost);

// Route to like a post
router.post("/:id/like", postController.updatePostLikes);

module.exports = router;
