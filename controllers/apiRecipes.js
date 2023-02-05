const Recipe = require("../models/Recipe");

module.exports = {
  //get list of recipes from the API
  getRecipes: async (req, res) => {
    try {
      //variable used in the fetch api
      let nextPage = '' || req.body.next,
        url = '';

      //determine url depending on user's request  
      if (req.body.next) {
        url = `https://api.edamam.com/api/recipes/v2?q=${req.body.searchItem}&app_key=${process.env.FOOD_KEY}&_${nextPage}&type=public&app_id=${process.env.FOOD_ID}`;
      } else {
        url = `https://api.edamam.com/api/recipes/v2?type=public&q=${req.body.searchItem}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`;
      };

      //fetches recipes from the EDAMAM api, specifically by name(s)
      const response = await fetch(url);
      const recipes = await response.json();

      //extract the link to the next page from the data,, whilst hiding api keys
      nextPage = recipes['_links']['next']['href'].split('_').filter(x => x.includes('cont='))[0].split('&')[0];

      console.log('Recipes fetched from API');
      //render recipe lookup page with additionally data (searched item, next recipes)
      res.render("recipeLookup.ejs", { title: "Recipe Lookup", apiRecipes: recipes['hits'], searched: req.body.searchItem, nextRecipes: nextPage });
    } catch (err) {
      console.log(err);
    };
  },

  //get individual recipe from the API
  getRecipe: async (req, res) => {
    try {
      //fetches a recipe from the EDAMAM api, specifically by ID
      const response = await fetch(`https://api.edamam.com/api/recipes/v2/${req.params.id}?type=public&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`);
      const recipe = await response.json();

      //render recipe page
      res.render("recipe.ejs", { title: "Recipe Lookup", apiRecipe: recipe });
    } catch (err) {
      console.log(err);
    }
  },

  //save the recipe details to DB 
  saveRecipe: async (req, res) => {
    try {
      console.log(req.body.recipeIngredients)

      //uploading/creating recipe on DB
      await Recipe.create({
        name: req.body.recipeName,
        image: req.body.recipeImage,
        cloudinaryId: '',
        type: req.body.recipeMealtype.split('/'),
        ingredients: req.body.recipeIngredients.split(',').map(ingredient => ingredient.trim()),
        instructions: [],
        reference: req.body.recipeReference,
        user: req.user.id,
      })
      console.log("recipe has been added!");
      //redirect to dashboard with information message
      req.flash("info", { msg: "Recipe was saved" });
      res.redirect("/dashboard");

    } catch (err) {
      console.log(err);
    }
  }
}
