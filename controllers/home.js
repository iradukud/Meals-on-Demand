module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", { title: "Login or Sign up" });
  },
};
