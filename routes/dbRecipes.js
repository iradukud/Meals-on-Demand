const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const dbRecipeController = require("../controllers/dbRecipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Recipe Routes */
router.post("/create", upload.single("recipeImage"), dbRecipeController.createRecipe);
router.get("/page/:number", dbRecipeController.nextPageRecipes);
router.get("/filter/:mealtype", dbRecipeController.filterDBRecipes);
router.get("/:id", dbRecipeController.getRecipe);
router.delete("/delete/:id", dbRecipeController.deleteRecipe);
router.post("/lookup", dbRecipeController.getSearchRecipes);
router.get("/pageLook/:number", dbRecipeController.nextLookPageRecipes);
router.post("/addIngrInst", dbRecipeController.addIngrInst);
router.put("/editIngrInst", dbRecipeController.editIngrInst);
router.delete("/deleteIngrInst/:id", dbRecipeController.deleteIngrInst);
router.put("/editNamRef", dbRecipeController.editNamRef);
router.put("/changeImage",upload.single("recipeImage"), dbRecipeController.changeImage);
router.put("/editType", dbRecipeController.editType);


module.exports = router;