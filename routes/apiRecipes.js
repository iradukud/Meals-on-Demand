const express = require("express");
const router = express.Router();
const apiRecipeController = require("../controllers/apiRecipes");

//api recipe Routes
//creation routes
router.post("/lookup", apiRecipeController.getRecipes);
router.post("/save", apiRecipeController.saveRecipe);

//retrieval routes
router.get("/:id", apiRecipeController.getRecipe);

module.exports = router;