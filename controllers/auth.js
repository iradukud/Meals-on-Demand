const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

/* Getting login page */
exports.getLogin = (req, res) => {
  //If signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

/* Login verification */
exports.postLogin = (req, res, next) => {
  //variable that holds an array of error messages
  const validationErrors = [];

  //if any of the inputs parameters are empty add said messages to the validationErrors variable  
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  //If the validationErrors array has any messages redirect to login page with error presented to the user   
  if (validationErrors.length) {
    console.log('At least one input field is empty')
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  //User authentification 
  passport.authenticate("local", (err, user, info) => {
    //if an error occurs end authentification process and return the error
    if (err) {
      return next(err);
    }

    //if user can't be find return corresponding error message and redirect back to page
    if (!user) {
      console.log("Emaiil/Password arent't in our database")
      req.flash("errors", info);
      return res.redirect("/login");
    }

    //User loging in
    req.logIn(user, (err) => {
      //if an error occurs end authentification process and return the error
      if (err) {
        return next(err);
      }

      //redirect to user's dashboard
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

/* User loging out */
exports.logout = (req, res) => {
  //passport function to log out
  req.logout(() => {
    console.log('User has logged out.')
  })

  //remove current user's session
  req.session.destroy((err) => {
    //if error console.log log it
    if (err) {
      console.log("Error : Failed to destroy the session during logout.", err);
    }
    //delete current user name
    req.user = null;
    //redirect to homepage
    res.redirect("/");
  });
};

/* Getting signp page */
exports.getSignup = (req, res) => {
  //if user is signed in already return redirect to dashboard page
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

/* Signup verification */
exports.postSignup = (req, res, next) => {
  //variable that holds an array of error messages
  const validationErrors = [];

  //if any of the inputs parameters are empty add said messages to the validationErrors variable 
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  //If the validationErrors array has any messages redirect to login page with error presented to the user     
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  //create new user using the User Schema
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  //Saving user's information
  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {

      //if an error occurs end function and return the error
      if (err) {
        return next(err);
      }

      //if user already exist return error and redirect back to page
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }

      //save user's information and redirect to dashboard page
      user.save((err) => {
        //if an error occurs end function and return the error
        if (err) {
          return next(err);
        }

        //User loging in
        req.logIn(user, (err) => {
          //if an error occurs end function and return the error
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};