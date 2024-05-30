const Notification = require("../models/Notification");
const User = require("../models/User");
const Mongoose = require("mongoose");

exports.getNotification = async (req, res) => {
  try {
    const { id } = req.user;
    const payload = await Notification.find({
      notificationFor: Mongoose.Types.ObjectId(id),
    })
      .populate("notificationOf", "picture username")
      .sort({ createdAt: -1 });
    if (!payload.length) {
      return res.status(404).json({
        code: 404,
        error: true,
        message: "No notification yet!",
        payload: [],
      });
    }
    return res.status(200).json({
      code: 200,
      error: false,
      message: `${payload.length} notification found`,
      payload,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: true,
      message: "Something went wrong",
      payload: [],
    });
  }
};
