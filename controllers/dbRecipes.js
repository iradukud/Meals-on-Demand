const Recipe = require("../models/Recipe");
const cloudinary = require("../middleware/cloudinary");


module.exports = {
  //create a new recipe 
  createRecipe: async (req, res) => {
    try {
      //variable that will store default image's url
      let defaultImage = ''

      //variable that will store provided image to cloud
      let result = ''

      //assign above variable depending if a file was provide
      if (!req.file) {
        //use default image
        defaultImage = 'https://res.cloudinary.com/dwwcootcr/image/upload/v1675384027/recipe-default-image_jabkjh.png'
      } else {
        //upload image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path)
      }

      //uploading/create recipe on DB
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
      //sending confirmation message w/redirect
      req.flash("info", { msg: "Recipe has been added!" });
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      //sending error message w/redirect
      req.flash("error", { msg: "Due to an error the Recipe was not added!" });
      res.redirect("/dashboard");
    }
  },

  //page controls for DB result, presented on Dashboard
  nextPageRecipes: async (req, res) => {
    try {
      //extract page number and meal type from the params
      const [num, mealType] = (req.params.number).split('_');
      //variable that will hold the recipes retrieved
      let recipes = '';

      //assigned recipe variable depending on inputs provided
      if (mealType != 'default') {
        recipes = await Recipe.find({ user: req.user.id, type: mealType }).sort({ name: 1 });
      } else {
        recipes = await Recipe.find({ user: req.user.id }).sort({ name: 1 });
      }

      //render dashboard with user's recipe and other parameters (title, page, filter)
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, page: num - 1, filter: mealType });
    } catch (err) {
      console.log(err);
    }
  },

  //applying filter to dashboard(DB) recipes
  filterDBRecipes: async (req, res) => {
    try {
      //retrieve user recipes that match filter
      const recipes = await Recipe.find({ user: req.user.id, type: req.params.mealtype }).sort({ name: 1 });

      console.log("filtered DB recipes for specific meal type(s)");
      //render dashboard with user's recipe filtered and other parameters (title, page, filter)
      res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, page: 0, filter: req.params.mealtype });
    } catch (err) {
      console.log(err);
    }
  },

  //retrieve individual recipe from DB
  getRecipe: async (req, res) => {
    try {
      console.log('Looking for specific recipe');
      //retrieves a recipe from the DB, specifically by ID
      const recipe = await Recipe.findById({ _id: req.params.id });

      //render recipe page with user's selected recipe
      res.render("recipe.ejs", { title: "Recipe Lookup", dbRecipe: recipe });
    } catch (err) {
      console.log(err);
    }
  },

  //delete a recipe from recipe from DB
  deleteRecipe: async (req, res) => {
    //find the recipe by id
    let recipe = await Recipe.findById({ _id: req.params.id });

    try {
      //delete recipe's image from cloudinary, if it was stored there
      if (recipe.cloudinaryId) {
        await cloudinary.uploader.destroy(recipe.cloudinaryId);
      }

      //delete recipe from DB
      await Recipe.remove({ _id: req.params.id });

      console.log("Deleted Recipe");
      //sending confirmation message w/redirect
      req.flash("info", { msg: "Recipe was deleted!" });
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      //sending error message w/redirect
      req.flash("error", { msg: "The recipe was not deleted!" });
      //render recipe page with user's selected recipe
      res.render("recipe.ejs", { title: "Recipe Lookup", dbRecipe: recipe })
    }
  },

  /* disabled for now
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
  */

  //get searched recipes from DB
  getSearchRecipes: async (req, res) => {
    try {
      //retrieves recipes from the DB, specifically by searched string
      const recipes = await Recipe.find({ user: req.user.id, name: { "$regex": req.body.searchItem, "$options": "i" } }).sort({ name: 1 });
      //render recipe lookup page with user's searched recipe(s)
      res.render("recipeLookup.ejs", { title: "Recipe Lookup", dbRecipes: recipes, filter: req.body.searchItem, page: 0 });
    } catch (err) {
      console.log(err);
      //sending error message w/redirect
      req.flash("error", { msg: "The search was not completed!" });
      //render recipe lookup page
      res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
    }
  },

  //page controls on the recipe look page
  nextLookPageRecipes: async (req, res) => {
    try {
      //extract page number and meal type from the params
      const [num, searched] = (req.params.number).split('_');

      //searched next set of searched recipes from the DB
      const recipes = await Recipe.find({ user: req.user.id, name: { "$regex": searched, "$options": "i" } }).sort({ name: 1 });

      //rendered the recipe lookup page with filters applied
      res.render("recipeLookup.ejs", { title: "Recipe Lookup", recipes: recipes, page: num - 1, filter: searched });
    } catch (err) {
      console.log(err);
      req.flash("error", { msg: "Next page could not be retrieved!" });
      //render recipe lookup page
      res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
    }
  },
  addIngrInst: async (req, res) => {
    //retrieve recipe by id
    let recipe = await Recipe.findById({ _id: req.body.recipeDBId });

    try {
      if (req.body.addIngredient) {
        //add new ingredient
        await Recipe.findOneAndUpdate({ _id: req.body.recipeDBId }, { $push: { ingredients: req.body.addIngredient } });
      } else if (req.body.addInstruction) {
        //add new instruction
        await Recipe.findOneAndUpdate({ _id: req.body.recipeDBId }, { $push: { instructions: req.body.addInstruction } });
      };

      console.log(`Item has been added!`);
      //retrieve new modified recipe
      recipe = await Recipe.findById({ _id: req.body.recipeDBId });
      //redirect to recipe page with information message
      req.flash("info", { msg: "Item has been added!" });
      //rendered the recipe lookup page with filters applied
      res.render("recipe.ejs", { title: "Recipe Lookup", dbRecipe: recipe });
    } catch (err) {
      console.log(err);
      req.flash("error", { msg: "Item could not be added" });
      //render recipe lookup page
      res.render("recipe.ejs", { title: "Recipe Lookup", dbRecipe: recipe });
    };
  },
};