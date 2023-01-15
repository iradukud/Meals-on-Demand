exports.getIndex = (req, res) => {
  //If signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("index.ejs", { title: "Login or Sign up" });
}

exports.getDashboard = (req, res) => {
  res.render("dashboard.ejs", { title: "Dashboard" });
}

exports.getAddRecipe = (req, res) => {
  res.render("addRecipe.ejs", { title: "Add Recipe" });
}

exports.getRecipeLookup = (req, res) => {
  res.render("recipeLookup.ejs", { title: "Recipe Lookup" });
}

exports.getAccount = (req, res) => {
  res.render("account.ejs", { title: "Account" });
}