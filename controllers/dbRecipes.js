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
        ingredients: req.body.recipeIngredients.split(".").map(x => x.trim()).filter(x => x != ''),
        instructions: req.body.recipeIngredients.split(".").map(x => x.trim()).filter(x => x != ''),
        reference: req.body.recipeReference,
        user: req.user.id,
      })

      console.log("recipe has been added!");
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  },

  nextPageRecipes: async (req, res) => {
    try {
      const [num, mealType] = (req.params.number).split('_');
      let recipes = '';
      if (mealType != 'default') {
        recipes = await Recipe.find({ user: req.user.id, type: mealType });
      } else {
        recipes = await Recipe.find({ user: req.user.id })
      }
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: num - 1, filter: mealType });
    } catch (err) {
      console.log(err);
    }
  },
  filterDBRecipes: async (req, res) => {
    try {
      console.log(req.params.mealtype)
      const recipes = await Recipe.find({ user: req.user.id, type: req.params.mealtype });
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: 0, filter: req.params.mealtype });
    } catch (err) {
      console.log(err);
    }
  },
}
