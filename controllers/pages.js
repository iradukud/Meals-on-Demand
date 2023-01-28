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

exports.getAccount = (req, res) => {
  res.render("account.ejs", { title: "Account" });
}