const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
  listingType: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
  },

  pictures: [
    {
      type: String,
    },
  ],

  licenseId: {
    type: String,
    required: true,
  },

  isSold: {
    type: Boolean,
    default: false,
  },

  purchasedBy: {
    type: ObjectId,
    ref: "User",
  },
  purchasedByName: {
    type: String,
  },

  purchasedAt: {
    type: Date,
  },

  listedBy: {
    type: ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["listed", "sold", "review"],
    default: "listed",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Listing", ListingSchema);
