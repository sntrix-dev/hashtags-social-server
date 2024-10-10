const Post = require("../models/Post"); // Assuming you have a Post model
const User = require("../models/User"); // Assuming you have a User model

// Handler function to get all posts by a user
const getAllPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ userId: userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Handler function to get all posts by tags (multiple)
const getPostsByTags = async (req, res) => {
  try {
    const tags = req.query.tags.split(",");
    const posts = await Post.find({ tags: { $in: tags } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by tags", error });
  }
};

// Handler function to get a post by id
const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post by id", error });
  }
};

// Handler function to get posts by multiple user ids
const getPostsByUserIds = async (req, res) => {
  try {
    const userIds = req.query.userIds.split(",");
    const posts = await Post.find({ userId: { $in: userIds } });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts by user ids", error });
  }
};

// Handler function to create a new post
const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Handler function to delete a post by id
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Handler function to update likes for a post and update user's favorite tags
const updatePostLikes = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { userId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const index = post.likes.indexOf(userId);
        let likeChange = 0;
        if (index === -1) {
            post.likes.push(userId); // Like the post
            likeChange = 1;
        } else {
            post.likes.splice(index, 1); // Unlike the post
            likeChange = -1;
        }

        const updatedPost = await post.save();

        // Update user's favorite tags
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const postTags = post.tags.slice(0, 3); // Get top 3 tags from the post
        user.favoriteTags = [...new Set([...user.favoriteTags, ...postTags])].slice(0, 5); // Update favorite tags, ensuring only 5 tags

        await user.save();

        // Increase or decrease the like count for all tags used in the post
        // Assuming you have a Tag model and a likeCount field in it
        await Promise.all(
            post.tags.map(async (tag) => {
                await Tag.findOneAndUpdate({ name: tag }, { $inc: { likeCount: likeChange } });
            })
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error updating post likes", error });
    }
};

// Handler function to add a comment to a post
const addCommentToPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId, comment } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ userId, comment, createdAt: new Date() });
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment to post", error });
  }
};



module.exports = {
  getAllPostsByUser,
  getPostsByTags,
  getPostById,
  getPostsByUserIds,
  createPost,
  deletePost,
  updatePostLikes,
  addCommentToPost,
};
