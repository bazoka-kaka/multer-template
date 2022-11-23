// external imports
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// internal imports
const path = require("path");
const fs = require("fs");
const UserModel = require("./models/User");
const app = express();

// mongoose config
mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("Connected to MongoDB");
    } else {
      console.log(err);
    }
  }
);

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
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// routes
app.post("/upload", upload.single("photo"), (req, res) => {
  const newUser = new UserModel({
    username: req.body.username,
    photo: {
      data: fs.readFileSync(path.join(__dirname, "uploads", req.file.filename)),
      filename: req.file.filename,
      mimetype: req.file.mimetype,
    },
  });
  newUser.save((err) => {
    if (err) console.log(err);
  });
  // username, photo
  res.json({
    message: `username: ${req.body.username}, photo: ${req.file.filename}, filetype: ${req.file.mimetype}`,
  });
});

app.get("/images/:username", (req, res) => {
  UserModel.findOne({ username: req.params.username }, (err, result) => {
    if (err) {
      res.json({ error: err });
    } else {
      const b64 = Buffer.from(result.photo.data).toString("base64");
      const mimetype = result.photo.mimetype;
      const content = fs.readFileSync(
        path.join(__dirname, "uploads", result.photo.filename)
      );
      if (!content) {
        fs.writeFileSync(
          path.join(__dirname, "uploads", result.photo.filename),
          b64
        );
        content = fs.readFileSync(
          path.join(__dirname, "uploads", result.photo.filename)
        );
      }
      res.writeHead(200, { "Content-Type": mimetype });
      res.end(content, "utf-8");
    }
  });
});

app.get("/", (req, res) => {
  res.send(`<img src='/images/Benzion' alt='Benzion' />`);
});

app.listen(3500, () => {
  console.log("server running on port 3500");
});
