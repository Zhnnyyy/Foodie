const express = require("express");
const router = express.Router();
const RecipeController = require("../controller/Recipe.controller");
const Recipe = new RecipeController();
const multer = require("multer");
const { route } = require("./User.routes");
const upload = multer({ dest: "/uploads", storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), Recipe.createRecipe);
router.post("/img", Recipe.getImage);
router.post("/list", Recipe.syncRecipe);
router.post("/like", Recipe.updateLikeStatus);
router.post("/search", Recipe.searchRecipe);
module.exports = router;
