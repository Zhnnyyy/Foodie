const express = require("express");
const UserController = require("../controller/User.controller");
const router = express.Router();
const User = new UserController();

router.post("/create", User.createUser);
router.post("/verification", User.verifyEmail);
router.post("/login", User.loginUser);
router.post("/post", User.userPosts);
router.post("/favorites", User.userFavorites);
module.exports = router;
