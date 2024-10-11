const express = require("express");
const { register, login, logout, authorize } = require("../controllers/auth");

const router = express.Router();

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

router.get("/authorize", authorize);

module.exports = router;
