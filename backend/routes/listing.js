const express = require("express");
const {
  createListing,
  getListing,
  buyListing,
  getBuyingOfUser,
  getMySoldListing,
  verifyListing,
  getAllListing,
} = require("../controllers/listing");
const { authUser } = require("../middlwares/auth");
const { parseFormData } = require("../middlwares/file");

const router = express.Router();
router.get("/getAllListing", getAllListing);
router.get("/all", getListing);
router.get("/buying", authUser, getBuyingOfUser);
router.get("/sold", authUser, getMySoldListing);
// router.get("/selling/:soldBy", getListing);
router.post("/", authUser, createListing);
router.post("/verify", authUser, verifyListing);
router.patch("/buy/:listingId/:userId", authUser, buyListing);
module.exports = router;
