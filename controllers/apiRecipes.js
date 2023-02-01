const Recipe = require("../models/Recipe");

module.exports = {
  //Get list of recipes from the API
  getRecipes: async (req, res) => {
    try {
      let nextPage = '' || req.body.next,
        url = ''

      if (req.body.next) {
        url = `https://api.edamam.com/api/recipes/v2?q=${req.body.searchItem}&app_key=${process.env.FOOD_KEY}&_${nextPage}&type=public&app_id=${process.env.FOOD_ID}`
      } else {
        url = `https://api.edamam.com/api/recipes/v2?type=public&q=${req.body.searchItem}&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`
      }
      console.log('Looking for recipes');

      //fetches recipes from the EDAMAM api, specifically by name(s)
      fetch(url)
        .then(res => res.json())
        .then(data => {
          //console log data to show object has been return from our request 
          console.log(data);

          //extract the link to the next page from the data,, whilst hiding api keys
          nextPage = data['_links']['next']['href'].split('_').filter(x => x.includes('cont='))[0].split('&')[0]

          //render recipe loopup page
          res.render("recipeLookup.ejs", { title: "Recipe Lookup", recipes: data['hits'], searched: req.body.searchItem, nextRecipes: nextPage });
        })
    } catch (err) {
      console.log(err);
    }
  },

  //Get individual recipe from api
  getRecipe: async (req, res) => {
    try {
      console.log('Looking for specific recipe');

      //fetches a recipe from the EDAMAM api, specifically by ID
      fetch(url = `https://api.edamam.com/api/recipes/v2/${req.params.id}?type=public&app_id=${process.env.FOOD_ID}&app_key=${process.env.FOOD_KEY}`)
        .then(res => res.json())
        .then(data => {
          //console log data to show object has been return from our request 
          console.log(data);
          //render recipe page
          res.render("recipe.ejs", { title: "Recipe Lookup", apiRecipe: data });
        })
    } catch (err) {
      console.log(err);
    }
  },

  //Save the recipe details to 
  saveRecipe: async (req, res) => {
    try {
      console.log("Saving data")
console.log(req.body.recipeIngredients)
      // Uploading/Creating recipe on DB
      await Recipe.create({
        name: req.body.recipeName,
        image: req.body.recipeImage,
        cloudinaryId:'',
        type: req.body.recipeMealtype.split('/'),
        ingredients: req.body.recipeIngredients.split(','),
        instructions: [],
        reference: req.body.recipeReference,
        user: req.user.id,
      })
      console.log("recipe has been added!");
      res.redirect("/dashboard");

    } catch (err) {
      console.log(err);
    }
  }
}
