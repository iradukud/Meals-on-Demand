const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const dbRecipeController = require("../controllers/dbRecipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Recipe Routes */
router.post("/create", upload.single("recipeImage"), dbRecipeController.createRecipes);




module.exports = router;