// import formidable from "formidable";
const formidable = require("formidable");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports.parseFormData = async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      req.file = files.file[0];
      uploadToCloudinary(req.file)
        .then((success) => {
          next();
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    console.log(`WARN ERROR:${err}`);
    return res.send(JSON.stringify(err));
  }
};

const uploadToCloudinary = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(file.filepath, (err, res) => {
      if (err) {
        // removeTmp(file.tempFilePath);
        console.log("this is error=======", err);
        return res.status(400).json({ message: "Upload image failed." });
      }
      resolve({
        url: res.secure_url,
      });
    });
  });
};
