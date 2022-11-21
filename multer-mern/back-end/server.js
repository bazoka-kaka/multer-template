const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;

// middlewares
app.use(express.static(path.join(__dirname, "uploads")));

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/upload", upload.single("image"), (req, res) => {
  let response = "<p>Upload Success</p>";
  response += "<a href='/'>Home</a><br />";
  response += `<img src='/${req.file.filename}' alt='${req.file.filename}' />`;
  res.send(response);
});

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
