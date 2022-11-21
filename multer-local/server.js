const express = require("express");
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "uploads")));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/upload-single", upload.single("single-image"), (req, res) => {
  console.log(JSON.stringify(req.file));
  var response = '<a href="/">Home</a><br>';
  response += "Files uploaded successfully.<br>";
  response += `<img src="./uploads/${req.file.name}" alt="${req.file.name}" /><br>`;
  return res.send(response);
});

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
