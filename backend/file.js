const express = require("express");
var router = express.Router();
const { upload } = require("./config/multer");
const { uploadToCloudinary } = require("./helpers/cloudinary");
router.post("/", upload.single("image"), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "bad Request - No file provided",
        payload: {},
        code: 400,
      });
    }

    const data = await uploadToCloudinary(req.file);

    if (!data || !data.url) {
      return res.status(400).json({
        error: true,
        message: "bad Request",
        payload: {},
        code: 400,
      });
    }
    return res.status(200).json({
      error: false,
      message: "Url fetched",
      payload: data.url || "",
      code: 200,
    });
  } catch (error) {}
});

module.exports = router;
