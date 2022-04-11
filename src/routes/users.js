const express = require("express");
const UserController = require("../controllers/users");

const router = express.Router();
const userController = new UserController();

router.get("/getUser", userController.findUserByUsername);

module.exports = router;