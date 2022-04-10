const express = require("express");
const ChatController = require("../controllers/chats");

const router = express.Router();
const chatController = new ChatController();

router.get("/", chatController.getChannels);
router.get("/create", chatController.createMessage);

module.exports = router;