const express = require("express");

const { authUser } = require("../middlwares/auth");
const { getNotification } = require("../controllers/notification");

const router = express.Router();
router.get("/all", authUser, getNotification);
module.exports = router;
