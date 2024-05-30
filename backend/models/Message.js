const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  sender: {
    type: ObjectId,
    ref: "User",
  },
  reciever: {
    type: ObjectId,
    ref: "User",
  },
  convId: {
    type: ObjectId,
    ref: "Conversation",
  },

  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
