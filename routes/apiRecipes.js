const express = require("express");
const router = express.Router();
const apiRecipeController = require("../controllers/apiRecipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Recipe Routes */
router.post("/lookup", apiRecipeController.getRecipes);
router.get("/:id", apiRecipeController.getRecipe);
router.post("/save", apiRecipeController.saveRecipe);



module.exports = router;