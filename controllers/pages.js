const Recipe = require("../models/Recipe");
const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getIndex = (req, res) => {
  //If signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("index.ejs", { title: "Login or Sign up" });
}

exports.getDashboard = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({name:1});
    res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, user: req.user, page: 0, filter: 'default' });
  } catch (err) {
    console.log(err);
  }
}

exports.getRecipeLookup = (req, res) => {
  res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
}

exports.getAccount = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    res.render("account.ejs", { title: "Account", user: user });
  } catch (err) {
    console.log(err);
  }
}