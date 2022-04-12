const express = require("express");
const AuthController = require("../controllers/auth");
const verifyNoSession = require("../middleware/verifyNoSession");

const router = express.Router();
const authController = new AuthController();

router.get("/login", verifyNoSession, authController.getLoginView);
router.post("/login", verifyNoSession, authController.logIn);
router.get("/signup", verifyNoSession, authController.getSignUpView);
router.post("/signup", verifyNoSession, authController.signUp.bind(authController));
router.get("/logout", authController.logOut);

module.exports = router;