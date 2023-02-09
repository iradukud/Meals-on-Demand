const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

/* authentication routes */
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.postSignup);
router.put("/editUsername", authController.editUsername);
router.put("/editEmail", authController.editEmail);
router.put("/editPassword", authController.editPassword);
router.delete("/delete", authController.deleteAccount);

module.exports = router;