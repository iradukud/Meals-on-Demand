const Recipe = require("../models/Recipe");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  //Create a new recipe 
  createRecipes: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path)

      // Uploading/Creating recipe on DB
      await Recipe.create({
        name: req.body.recipeName,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        type: [req.body.breakfast, req.body.brunch, req.body.lunch, req.body.dinner, req.body.snack, req.body.teatime].filter(x => x != undefined),
        ingredients: req.body.recipeIngredients.split("."),
        instructions: req.body.recipeIngredients.split("."),
        reference: req.body.recipeReference,
        user: req.user.id,
      })

      console.log("recipe has been added!");
      res.redirect("/dashboard");

    } catch (err) {
      console.log(err);
    }
  },
}
