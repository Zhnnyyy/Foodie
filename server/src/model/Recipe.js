require("dotenv").config();
const database = require("../database/connection");
const db = new database();
const dbx = require("../model/Dropbox");

class Recipe {
  async _executeQuery(que, params) {
    try {
      const result = await db.query(que, params);
      return { Error: false, data: result.rows };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addRecipe(body) {
    return await this._executeQuery(
      `insert into recipe(title,ingredients,instructions,image,user_id) values($1,$2,$3,$4,$5)`,
      [body.name, body.ingredients, body.instructions, body.path, body.userID]
    );
  }

  async uploadFood(req) {
    const file = req.file;
    const path = `${req.body.userID}_${file.originalname.replace("_", "")}`;
    const dropbox = new dbx();
    dropbox.init();
    const result = await dropbox.uploadFoodImage(path, file.buffer);
    return result;
  }

  async isLiked(req) {
    return await this._executeQuery(
      `select count(*) as result from likes where recipe_id=$1 and user_id=$2`,
      [req.recipe_id, req.user_id]
    );
  }

  async updateRecipeLike(req) {
    const isLiked = await this.isLiked(req);
    let status;

    if (isLiked.data[0].result == 1) {
      // status = await this.unlikeRecipe(req);
      status = { HELLO: "HELLO" };
    } else {
      status = await this.likeRecipe(req);
    }
    return status;
  }

  async likeRecipe(req) {
    return await this._executeQuery(
      `insert into likes(recipe_id, user_id) values($1,$2)`,
      [req.recipe_id, req.user_id]
    );
  }

  async likesCounter(id) {
    return await this._executeQuery(
      `select count(*) as result from likes where recipe_id=$1`,
      [id]
    );
  }

  async unlikeRecipe(req) {
    return await this._executeQuery(
      `delete from likes where recipe_id=$1 and user_id=$2`,
      [req.recipe_id, req.user_id]
    );
  }

  async getFoodImage(req) {
    const dropbox = new dbx();
    return await dropbox.getFoodLink(req.path);
  }

  async getRecipe() {
    return await this._executeQuery("SELECT * FROM recipe", []);
  }

  async searchRecipe(req) {
    return await this._executeQuery(
      "SELECT * FROM recipe WHERE LOWER(title) like LOWER($1)",
      [`%${req.search}%`]
    );
  }
}
module.exports = Recipe;
