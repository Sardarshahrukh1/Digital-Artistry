const Notification = require("../models/Notification");
exports.addNotification = async (payload) => {
  try {
    const notifObj = new Notification(payload);
    return await notifObj.save();
  } catch (error) {
    throw error;
  }
};
