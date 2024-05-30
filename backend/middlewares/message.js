const Mongoose = require("mongoose");
const Conversation = require("../models/Conversation");

exports.validateConversation = async (req, res, next) => {
  try {
    const { reciever, convId } = req.body;
    if (!convId) {
      const conversation = new Conversation({
        sender: Mongoose.Types.ObjectId(req.user.id),
        reciever: Mongoose.Types.ObjectId(reciever),
        lastMessage: "hi, from system",
      });
      const newConv = await conversation.save();
      req.body.convId = newConv._id;
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
