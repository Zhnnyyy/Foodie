const UserModal = require("../model/User");
const user = new UserModal();
const RecipeModel = require("../model/Recipe");
const Recipe = new RecipeModel();
class UserController {
  async createUser(req, res) {
    const result = await user.createUser(req.body);
    if (!result.Error)
      res.status(201).json({
        Error: false,
        message: "User has been created successfully",
      });
    else
      res.status(500).json({ Error: true, message: "Internal Server Error" });
  }

  async verifyEmail(req, res) {
    const validate = await user.validateUser(req.body);
    if (validate.Error) {
      return res
        .status(500)
        .json({ Error: true, message: "Internal Server Error" });
    }

    if (validate.data[0].result != 0) {
      res.status(400).json({ Error: true, message: "User already exists" });
    } else {
      const verify = await user.sendMail(req.body);
      res.json(verify);
    }
  }

  async userPosts(req, res) {
    const result = await user.userPosts(req.body);
    let arr = await Promise.all(
      result.data.map(async (food) => {
        const url = await Recipe.getFoodImage({ path: food.image });
        const likeCounter = await Recipe.likesCounter(food.id);
        const like = await Recipe.isLiked({
          recipe_id: food.id,
          user_id: req.body.userID,
        });
        return {
          ...food,
          path: url.msg,
          like: like.data[0].result,
          likes: likeCounter.data[0].result,
        };
      })
    );
    res.status(200).json(arr);
  }

  async loginUser(req, res) {
    const result = await user.loginUser(req.body);
    res.status(200).json(result);
  }

  async userFavorites(req, res) {
    const result = await user.userFavorites(req.body);
    const arr = await Promise.all(
      result.data.map(async (food) => {
        const url = await Recipe.getFoodImage({ path: food.image });
        const likeCounter = await Recipe.likesCounter(food.id);
        const like = await Recipe.isLiked({
          recipe_id: food.id,
          user_id: req.body.userID,
        });
        return {
          ...food,
          path: url.msg,
          likes: likeCounter.data[0].result,
          like: like.data[0].result,
        };
      })
    );
    res.status(200).json(arr);
  }
}
module.exports = UserController;
