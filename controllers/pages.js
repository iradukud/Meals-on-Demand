const Recipe = require("../models/Recipe");

exports.getIndex = (req, res) => {
  //If signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("index.ejs", { title: "Login or Sign up" });
}

exports.getDashboard = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id });
    res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: 0, filter: 'default' });
  } catch (err) {
    console.log(err);
  }
}

exports.getRecipeLookup = (req, res) => {
  res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
}

exports.getAccount = (req, res) => {
  res.render("account.ejs", { title: "Account" });
}