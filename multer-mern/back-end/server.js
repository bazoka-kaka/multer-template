const express = require("express");
const multer = require("multer");

const path = require("path");
const app = express();

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// routes
app.post("/upload", upload.single("photo"), (req, res) => {
  // username, photo
  res.json({ message: `user ${username} created!` });
});

app.listen(3500, () => {
  console.log("server running on port 3500");
});
