const multer = require("multer");
const path = require("path");
// Configure Multer
// It simplifies the file upload process by handling form-data requests
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

module.exports.upload = upload;
