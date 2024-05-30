const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// require("./config/multer");
const path = require("path");
const multer = require("multer");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/file", require("./file.js"));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// //routes
app.use("/listing", require("./routes/listing.js"));
app.use("/notifications", require("./routes/notification.js"));
app.use("/conversation", require("./routes/conversation.js"));
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
