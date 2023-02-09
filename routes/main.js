const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pages");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//page routes
//retrieval routes
router.get("/", pageController.getIndex);
router.get("/dashboard", ensureAuth, pageController.getDashboard);
router.get("/recipeLookup", ensureAuth, pageController.getRecipeLookup);
router.get("/account", ensureAuth, pageController.getAccount);
router.get("/login", pageController.getLogin);
router.get("/signup", pageController.getSignup);

module.exports = router;