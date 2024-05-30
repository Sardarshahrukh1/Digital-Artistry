const Conversation = require("../models/Conversation");
const Mongoose = require("mongoose");
const User = require("../models/User");
const Message = require("../models/Message");

exports.getConversation = async (req, res) => {
  try {
    const { convId } = req.params;
    let con = await Conversation.findOne({
      _id: Mongoose.Types.ObjectId(convId),
    }).populate("reciever sender", "first_name last_name username _id picture");

    return res.status(200).json({
      code: 200,
      error: false,
      message: `Conversation found`,
      payload: con,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { reciever } = req.body;
    const conversation = new Conversation({
      sender: req.user.id,
      reciever,
      lastMessage: "Hi",
    });
    const data = await conversation.save();
    // let con = await Conversation.findOne({
    //   _id: Mongoose.Types.ObjectId(convId),
    // }).populate("reciever sender", "first_name last_name username _id picture");

    return res.status(200).json({
      code: 200,
      error: false,
      message: `Conversation created`,
      payload: { _id: data._id },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    let con = await Conversation.find({
      $or: [
        { reciever: Mongoose.Types.ObjectId(req.user.id) },
        { sender: Mongoose.Types.ObjectId(req.user.id) },
      ],
    }).populate("reciever sender", "first_name last_name username _id picture");

    return res.status(200).json({
      code: 200,
      error: false,
      message: `Conversatsssion found`,
      payload: con.filter((c) => c.reciever),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, reciever, convId } = req.body;

    const message = new Message({
      sender: Mongoose.Types.ObjectId(req.user.id),
      reciever: Mongoose.Types.ObjectId(reciever),
      convId: Mongoose.Types.ObjectId(convId),
      text,
    });

    const saveMessage = message.save();

    const conversation = Conversation.updateOne(
      {
        _id: Mongoose.Types.ObjectId(convId),
      },
      {
        $set: {
          lastMessage: text,
        },
      }
    );
    // Promise Represents An Activity That Will Either Be Completed Or Declined.
    const data = await Promise.all([saveMessage, conversation]);
    return res.status(200).json({
      code: 200,
      error: false,
      message: `Message sent`,
      payload: {},
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { convId } = req.params;
    const messages = await Message.find({
      convId: Mongoose.Types.ObjectId(convId),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      code: 200,
      error: false,
      message: `Message fetched`,
      payload: messages,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
