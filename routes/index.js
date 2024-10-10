const validateToken = require("../lib/validate");
const authRoutes = require("./auth");
const postsRoutes = require("./posts");
const usersRoutes = require("./user");
const { Router } = require("express");

const router = Router();

// Middleware to prefix all routes with /api
router.use("/auth", authRoutes);
router.use(validateToken);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);

module.exports = router;
