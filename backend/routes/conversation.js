const express = require("express");

const { authUser } = require("../middlwares/auth");
const { validateConversation } = require("../middlwares/message");
const {
  getConversation,
  sendMessage,
  fetchMessages,
  getAllConversations,
  createConversation,
} = require("../controllers/conversation");

const { getFriendsList } = require("../controllers/user");

const router = express.Router();
router.post("/", authUser, createConversation);
router.get("/getFriends", authUser, getFriendsList);
router.get("/all", authUser, getAllConversations);
router.get("/fetch-messages/:convId", authUser, fetchMessages);
router.get("/conv/:convId", authUser, getConversation);
router.post("/send-message", authUser, validateConversation, sendMessage);

module.exports = router;
