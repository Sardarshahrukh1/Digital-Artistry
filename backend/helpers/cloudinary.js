const { cloudinary } = require("../config/cloudinary");

module.exports.uploadToCloudinary = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file.path, (err, res) => {
      if (err) {
        return res.status(400).json({ message: "Upload image failed." });
      }
      resolve({
        url: res.secure_url,
      });
    });
  });
};
