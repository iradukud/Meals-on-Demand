const Recipe = require("../models/Recipe");
const cloudinary = require("../middleware/cloudinary");


module.exports = {
  //Create a new recipe 
  createRecipe: async (req, res) => {
    try {
      //variable that will store default image's url
      let defaultImage = ''

      // Upload image to cloudinary
      let result = ''

      if (!req.file) {
        //use default image
        defaultImage = 'https://res.cloudinary.com/dwwcootcr/image/upload/v1675384027/recipe-default-image_jabkjh.png'
      } else {
        // Upload image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path)
      }

      // Uploading/Creating recipe on DB
      await Recipe.create({
        name: (req.body.recipeName).split(' ').map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()).join(' '),
        image: result.secure_url || defaultImage,
        cloudinaryId: result.public_id || '',
        type: [req.body.breakfast, req.body.brunch, req.body.lunch, req.body.dinner, req.body.snack, req.body.teatime].filter(x => x != undefined),
        ingredients: req.body.recipeIngredients.split(".").map(x => x.trim()).filter(x => x != '') || [],
        instructions: req.body.recipeInstructions.split(".").map(x => x.trim()).filter(x => x != '') || [],
        reference: req.body.recipeReference || '',
        user: req.user.id,
      })

      console.log("recipe has been added!");
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  },

  //Page controls
  nextPageRecipes: async (req, res) => {
    try {
      //Extract page number and meal type from the params
      const [num, mealType] = (req.params.number).split('_');
      let recipes = '';

      //Applied necessary filter/search parameters for the DB
      if (mealType != 'default') {
        recipes = await Recipe.find({ user: req.user.id, type: mealType }).sort({ name: 1 });
      } else {
        recipes = await Recipe.find({ user: req.user.id }).sort({ name: 1 });
      }

      //Rendered the dashboard with filters applied
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: num - 1, filter: mealType });
    } catch (err) {
      console.log(err);
    }
  },

  //filtering through DB recipes
  filterDBRecipes: async (req, res) => {
    try {
      //filter for recipes by meal type
      const recipes = await Recipe.find({ user: req.user.id, type: req.params.mealtype }).sort({ name: 1 });
      console.log("filtered DB recipes for specific meal type(s)");
      //Rendered the dashboard with recipes that fit the meal type 
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: 0, filter: req.params.mealtype });
    } catch (err) {
      console.log(err);
    }
  },

  //Get individual recipe from DB
  getRecipe: async (req, res) => {
    try {
      console.log('Looking for specific recipe');
      //retrieves a recipe from the DB, specifically by ID
      const recipe = await Recipe.findById({ _id: req.params.id });
      console.log(recipe);
      //render recipe page
      res.render("recipe.ejs", { title: "Recipe Lookup", dbRecipe: recipe });

    } catch (err) {
      console.log(err);
    }
  },

  //delete recipe from recipe from DB
  deleteRecipe: async (req, res) => {
    try {
      //find the recipe by id
      let recipe = await Recipe.findById({ _id: req.params.id });

      //delete recipe's image from cloudinary
      if (recipe.cloudinaryId) {
        await cloudinary.uploader.destroy(recipe.cloudinaryId);
      }

      //delete recipe from db
      await Recipe.remove({ _id: req.params.id });

      console.log("Deleted Recipe");
      res.redirect("/Dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/Dashboard");
    }
  },

  //edit recipe from recipe from DB
  editRecipe: async (req, res) => {
    try {

      //find the recipe by id
      let recipe = await Recipe.findById({ _id: req.body.recipeId });

      //delete recipe's image from cloudinary
      if (recipe.cloudinaryId) {
        await cloudinary.uploader.destroy(recipe.cloudinaryId);
      }
      
      //delete recipe from db
      await Recipe.remove({ _id: req.body.recipeId })

      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path)

      //Create new DB recipe
      await Recipe.create({
        name: (req.body.recipeName).split(' ').map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()).join(' '),
        image: result.secure_url,
        cloudinaryId: result.public_id,
        type: [req.body.breakfast, req.body.brunch, req.body.lunch, req.body.dinner, req.body.snack, req.body.teatime].filter(x => x != undefined),
        ingredients: req.body.recipeIngredients.split(".").map(x => x.trim()).filter(x => x != ''),
        instructions: req.body.recipeInstructions.split(".").map(x => x.trim()).filter(x => x != '') || [],
        reference: req.body.recipeReference,
        user: req.user.id,
      })

      console.log("Edited Recipe");
      res.redirect("/Dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/Dashboard");
    }
  },

  //get searched recipes from DB
  getSearchRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find({ user: req.user.id, name: { "$regex": req.body.searchItem, "$options": "i" } }).sort({ name: 1 });
      res.render("recipeLookup.ejs", { title: "Recipe Lookup", dbRecipes: recipes, filter: req.body.searchItem, page: 0 });
    } catch (err) {
      console.log(err);
    }
  },

  //Page controls
  nextLookPageRecipes: async (req, res) => {
    try {
      //Extract page number and meal type from the params
      const [num, searched] = (req.params.number).split('_');
      let recipes = '';

      //searched next set of searched recipes from the DB
      recipes = await Recipe.find({ user: req.user.id, name: { "$regex": searched, "$options": "i" } }).sort({ name: 1 });

      //Rendered the dashboard with filters applied
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: num - 1, filter: searched });
    } catch (err) {
      console.log(err);
    }
  },
}