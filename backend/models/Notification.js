const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  notificationOf: {
    type: ObjectId,
    ref: "User",
  },
  notificationFor: {
    type: ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
