const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const pageController = require("../controllers/pages");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

/* Page Routes */
router.get("/", pageController.getIndex);
router.get("/dashboard", ensureAuth, pageController.getDashboard);
router.get("/recipeLookup", pageController.getRecipeLookup);
router.get("/account", pageController.getAccount);

/* Loging Routes */
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.put("/editUsername", authController.editUsername);
router.put("/editEmail", authController.editEmail);
router.put("/editPassword", authController.editPassword);
router.delete("/delete", authController.deleteAccount);


module.exports = router;