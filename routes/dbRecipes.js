const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const dbRecipeController = require("../controllers/dbRecipes");

//db recipe routes
//creation routes
router.post("/create", upload.single("recipeImage"), dbRecipeController.createRecipe);
router.post("/addIngrInst", dbRecipeController.addIngrInst);
router.post("/lookup", dbRecipeController.getSearchRecipes);

//retrieval routes
router.get("/:id", dbRecipeController.getRecipe);
router.get("/filter/:mealtype", dbRecipeController.filterDBRecipes);
router.get("/page/:number", dbRecipeController.nextPageRecipes);
router.get("/pageLook/:number", dbRecipeController.nextLookPageRecipes);

//edit routes
router.put("/editNamRef", dbRecipeController.editNamRef);
router.put("/changeImage",upload.single("recipeImage"), dbRecipeController.changeImage);
router.put("/editType", dbRecipeController.editType);
router.put("/editIngrInst", dbRecipeController.editIngrInst);

//deletion routes
router.delete("/delete/:id", dbRecipeController.deleteRecipe);
router.delete("/deleteIngrInst/:id", dbRecipeController.deleteIngrInst);

module.exports = router;