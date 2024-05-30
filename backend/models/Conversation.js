const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const ConversationSchema = new mongoose.Schema({
  sender: {
    type: ObjectId,
    ref: "User",
  },
  reciever: {
    type: ObjectId,
    ref: "User",
  },

  lastMessage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
