const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const Recipe = require("../models/Recipe");
const cloudinary = require("../middleware/cloudinary");

/* Getting login page */
exports.getLogin = (req, res) => {
  //If signed in redirect to dashboard
  if (req.user) {
    return res.redirect("/dashboard");
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
      console.log("Email/Password arent't in our database")
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
      res.redirect(req.session.returnTo || "/dashboard");
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
    return res.redirect("/dashboard");
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
    return res.redirect("/signup");
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
        return res.redirect("/signup");
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
          res.redirect("/dashboard");
        });
      });
    }
  );
};

/* Change User's username */
exports.editUsername = (req, res, next) => {
  User.findOne(
    { userName: req.body.username },
    async (err, existingUser) => {

      //if an error occurs end function and return the error
      if (err) {
        return next(err);
      }

      //if user is already in use return error and redirect back to account page
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that username already exists.",
        });
        console.log('Account with that username already exists.')
        res.redirect("/account");
      } else { //else change the current account's username
        await User.findByIdAndUpdate({ _id: req.user.id }, { userName: req.body.username })
        console.log('Account username changed.')
        req.flash("info", { msg: 'Username change successful' })
        res.redirect("/account");
      }
    }
  );
}

/* Change User's email */
exports.editEmail = (req, res, next) => {
  //variable that holds an array of error messages
  const validationErrors = [];

  //if any of the inputs parameters are empty add said messages to the validationErrors variable  
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }

  //If the validationErrors array has any messages redirect to login page with error presented to the user   
  if (validationErrors.length) {
    console.log('email input field is empty')
    req.flash("errors", validationErrors);
    return res.redirect("/account");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  User.findOne(
    { email: req.body.email },
    async (err, existingUser) => {

      //if an error occurs end function and return the error
      if (err) {
        return next(err);
      }

      //if user is already in use return error and redirect back to account page
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email already exists.",
        });
        console.log('Account with that email already exists.')
        res.redirect("/account");
      } else { //else change the current account's username
        await User.findByIdAndUpdate({ _id: req.user.id }, { email: req.body.email })
        console.log('Account email changed.')
        req.flash("info", { msg: 'Email change successful' })
        res.redirect("/account");
      }
    }
  );
}

/* Change User's password */
exports.editPassword = async (req, res, next) => {
  //variable that holds an array of error messages
  const validationErrors = [];

  if (validator.isEmpty(req.body.password && req.body.confirmPassword && req.body.oldPassword)) {
    validationErrors.push({ msg: "Password fields cannot be blank." });
  }
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  //If the validationErrors array has any messages redirect to account page with error presented to the user   
  if (validationErrors.length) {
    console.log('At least one input field is empty')
    req.flash("errors", validationErrors);
    return res.redirect("/account");
  }

  bcrypt.compare(req.body.oldPassword, req.user.password, (err, isMatch) => {
    if (err) {
      throw err
    } else if (!isMatch) {
      console.log("Password doesn't match account password!")
      validationErrors.push({ msg: "Password doesn't match account password" })
      req.flash("errors", validationErrors);
      return res.redirect("/account")
    }
  })

  //encryting the new password
  const hash = await bcrypt.hash(req.body.password, 10)

  //changing user's password
  try {
    await User.findByIdAndUpdate({ _id: req.user.id }, { password: hash })
    console.log('Account password changed.')
    req.flash("info", { msg: 'Password change successful' })
    return res.redirect("/account");
  } catch (err) {
    console.log(err);
    req.flash("errors", err);
    return res.redirect("/account");
  }
}

exports.deleteAccount = async (req, res, next) => {
  try {
    //retrieve all the accounts recipes
    recipes = await Recipe.find({ user: req.user.id });

    //for each recipe delete it's cloudinary save
    recipes.forEach(async (recipe) => {
      await cloudinary.uploader.destroy(recipe.cloudinaryId)
      console.log('Image has been removed from the Cloud')
    })

    //remove all the user's recipes from the DB
    await Recipe.deleteMany({ user: req.user.id })

    //remove the user from the DB
    await User.findByIdAndDelete({ _id: req.user.id })

    //remove current user's session
    await req.session.destroy((err) => {
      //if error console.log log it
      if (err) {
        console.log("Error : Failed to destroy the session during logout.", err);
      }
      //delete current user name
      req.user = null;
    });

    console.log('Account has been deleted.')
    //redirect to homepage
    res.redirect("/");
  } catch (err) {
    console.log(err);
    //send an error message if anything fail
    req.flash("errors", { msg: 'error occuured during the deletion process'});
    return res.redirect("/account");
  }
}