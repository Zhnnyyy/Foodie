require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./src/routes/User.routes");
const recipeRoutes = require("./src/routes/Recipe.routes");
const multer = require("multer");
const app = express();
const port = 4000;

app.use(
  cors({
    origin: "https://foodie-server-opal.vercel.app/",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/recipe", recipeRoutes);

app.listen(port, () => console.log(`Server listening on port: ${port}`));
