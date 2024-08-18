require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const app = express();
app.use(cors());
const port = 4000;
const userRoutes = require("./src/routes/User.routes");
const recipeRoutes = require("./src/routes/Recipe.routes");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/recipe", recipeRoutes);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
