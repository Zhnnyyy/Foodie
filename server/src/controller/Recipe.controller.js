const RecipeModel = require("../model/Recipe");
const Recipe = new RecipeModel();
const dbx = require("../model/Dropbox");
class RecipeController {
  async createRecipe(req, res) {
    const result = await Recipe.uploadFood(req);
    req.body.path = result.path;
    if (result.Error) {
      //Delete from dropbox
      const dropbox = new dbx();
      const deleteResult = await dropbox.removeFood(result.path);
      if (deleteResult.Error) res.status(204).json(deleteResult);
      else res.status(200).json(deleteResult);
    } else {
      //save from dtabase
      const result = await Recipe.addRecipe(req.body);
      res.json(result);
    }
  }

  async syncRecipe(req, res) {
    const result = await Recipe.getRecipe();
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

  async searchRecipe(req, res) {
    const result = await Recipe.searchRecipe(req.body);
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
          like: like.data[0].result,
          likes: likeCounter.data[0].result,
        };
      })
    );

    res.status(200).json(arr);
  }

  async getImage(req, res) {
    const result = await Recipe.getFoodImage(req.body);
    if (result.Error) res.status(500).json(result);
    else res.status(200).json(result);
  }

  async updateLikeStatus(req, res) {
    // const result = await Recipe.updateRecipeLike({
    //   recipe_id: req.body.recipe_id,
    //   user_id: req.body.userID,
    // });
    // res.json(result);
    res.json({ HELLO: "HEHEHE" });
  }
}
module.exports = RecipeController;
