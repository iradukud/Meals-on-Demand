const Recipe = require("../models/Recipe");
const User = require("../models/User");

//get main/index page
exports.getIndex = (req, res) => {
  //if already signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("index.ejs", { title: "Login or Sign up" });
}

//get dashboard/landing page
exports.getDashboard = async (req, res) => {
  try {
    //retrieve user's recipes
    const recipes = await Recipe.find({ user: req.user.id }).sort({ name: 1 });
    //render dashboard with user's recipe and other parameters (title, page, filter)
    res.render("dashboard.ejs", { title: "Dashboard", recipes: recipes, page: 0, filter: 'default' });
  } catch (err) {
    console.log(err);
  }
}

//retrieve recipe lookup page
exports.getRecipeLookup = (req, res) => {
  //render recipeLookup with user's DB recipe and other parameters (title)
  res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
}

//retrieve account page
exports.getAccount = async (req, res) => {
  try {
    //retrieve user's details
    const user = await User.findById({ _id: req.user.id });
    //render account with user's information and other parameters (title user)
    res.render("account.ejs", { title: "Account", user: user });
  } catch (err) {
    console.log(err);
  }
}

//retrieve login page 
exports.getLogin = (req, res) => {
  //if signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login",
  });
}

//retrieve signup page 
exports.getSignup = (req, res) => {
  //if user is signed in already return redirect to dashboard page
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("signup", {
    title: "Create Account",
  });
};