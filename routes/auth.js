const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


/* authentication routes */
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.postSignup);
router.put("/editUsername", ensureAuth, authController.editUsername);
router.put("/editEmail", ensureAuth, authController.editEmail);
router.put("/editPassword", ensureAuth, authController.editPassword);
router.delete("/delete", ensureAuth, authController.deleteAccount);



module.exports = router;