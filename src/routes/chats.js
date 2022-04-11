const express = require("express");
const ChatController = require("../controllers/chats");

const router = express.Router();
const chatController = new ChatController();

router.get("/", chatController.getChatsView);
router.get("/channels", chatController.getChannels);
router.post("/create", chatController.createMessage);

module.exports = router;