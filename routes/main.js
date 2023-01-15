const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const pageController = require("../controllers/pages");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Page Routes */
router.get("/", pageController.getIndex);
router.get("/dashboard", ensureAuth, pageController.getDashboard);
router.get("/addRecipe",  pageController.getAddRecipe);
router.get("/recipeLookup", pageController.getRecipeLookup);
router.get("/account", pageController.getAccount);

/* Loging Routes */
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);


router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);


module.exports = router;