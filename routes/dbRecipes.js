const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const dbRecipeController = require("../controllers/dbRecipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Recipe Routes */
router.post("/create", upload.single("recipeImage"), dbRecipeController.createRecipes);
router.get("/page/:number", dbRecipeController.nextPageRecipes);
router.get("/filter/:mealtype", dbRecipeController.filterDBRecipes);
router.get("/:id", dbRecipeController.getRecipe);
router.delete("/delete/:id", dbRecipeController.deleteRecipe);
router.put("/edit", upload.single("recipeImage"),dbRecipeController.editRecipe)


module.exports = router;