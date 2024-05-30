const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Mongoose = require("mongoose");
const { addNotification } = require("../helpers/notification.helper");

exports.getBuyingOfUser = async (req, res) => {
  try {
    const lists = await Listing.find({
      isSold: true,
      status: "sold",
      purchasedBy: Mongoose.Types.ObjectId(req.user.id),
    });
    if (lists.length) {
      return res.status(200).json({
        code: 200,
        error: false,
        message: `${lists.length} listing found`,
        payload: lists,
      });
    }
    return res.status(404).json({
      code: 404,
      error: false,
      message: `${lists.length} listing found`,
      payload: [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMySoldListing = async (req, res) => {
  try {
    const lists = await Listing.find({
      isSold: true,
      status: "sold",
      // purchasedBy: { $ne: Mongoose.Types.ObjectId(req.user.id) },
      listedBy: Mongoose.Types.ObjectId(req.user.id),
    }).populate("purchasedBy", "username");
    if (lists.length) {
      return res.status(200).json({
        code: 200,
        error: false,
        message: `${lists.length} listing found`,
        payload: lists,
      });
    }
    return res.status(404).json({
      code: 404,
      error: false,
      message: `${lists.length} listing found`,
      payload: [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const lists = await Listing.find({ isSold: false });
    if (lists.length) {
      return res.status(200).json({
        code: 200,
        error: false,
        message: `${lists.length} listing found`,
        payload: lists,
      });
    }
    return res.status(404).json({
      code: 404,
      error: false,
      message: `${lists.length} listing found`,
      payload: [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllListing = async (req, res) => {
  try {
    const lists = await Listing.find({}).populate(
      "listedBy purchasedBy",
      "first_name last_name picture"
    );
    return res.json(lists);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createListing = async (req, res) => {
  try {
    const list = await new Listing(req.body).save();
    if (list && list._id) {
      return res.status(201).json({
        code: 201,
        message: "New Listing Added",
        payload: list,
        error: false,
      });
    }

    return res.status(400).json({
      code: 400,
      message: "Bad request",
      payload: {},
      error: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Something went wrong",
      payload: {},
      error: true,
    });
  }
};

exports.verifyListing = async (req, res) => {
  try {
    const { licenseId } = req.body;
    const list = await Listing.findOne({
      licenseId,
      isSold: true,
      status: "sold",
    }).populate("listedBy purchasedBy", "first_name last_name");
    // const list = await new Listing(req.body).save();
    if (list && list._id) {
      return res.status(200).json({
        code: 200,
        message: "Listing verified",
        payload: list,
        error: false,
      });
    }

    return res.status(400).json({
      code: 400,
      message: "Bad request",
      payload: {},
      error: true,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Something went wrong",
      payload: {},
      error: true,
    });
  }
};

exports.buyListing = async (req, res) => {
  try {
    const { listingId, userId } = req.params;
    const { walletAmount } = req.body;

    if (!listingId || !userId) {
      return res.status(400).json({
        code: 400,
        message: "Bad request",
        payload: {},
        error: true,
      });
    }
    const payload = await Listing.findOneAndUpdate(
      {
        _id: Mongoose.Types.ObjectId(listingId),
        price: {
          $lt: +walletAmount,
        },
      },
      {
        isSold: true,
        purchasedBy: Mongoose.Types.ObjectId(userId),
        purchasedAt: new Date(),
        status: "sold",
      }
    );

    if (payload && payload._id) {
      const { price } = payload;
      let finalAmount = 0;
      finalAmount = walletAmount - price;
      const user = await User.findByIdAndUpdate(req.user.id, {
        walletAmount: finalAmount,
      });
      addNotification({
        title: `${payload.title} have been bought successfully by ${user.username}.`,
        notificationFor: payload.listedBy,
        notificationOf: user._id,
      });
      return res.status(201).json({
        code: 201,
        message: "Listing purchased",
        payload: {
          data: payload,
          walletUpdatedAmount: finalAmount,
        },
        error: false,
      });
    } else {
      return res.status(400).json({
        code: 400,
        message: "Bad request - Wallet",
        payload: {},
        error: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Something went wrong",
      payload: {},
      error: true,
    });
  }
};
