const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const ImageModel = require("./models/Image");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.static(path.join(__dirname, "uploads")));

// mongoose
mongoose.connect(
  process.env.DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("connected to MongoDB");
    } else {
      console.log(err);
    }
  }
);

// multer
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

app.get("/image/:filename", (req, res) => {
  ImageModel.findOne({ filename: req.params.filename }, (err, result) => {
    if (err) {
      res.json({ error: err });
    } else {
      const b64 = Buffer.from(result.data).toString("base64");
      const mimeType = result.contentType;
      res.send(
        `<img src="data:${mimeType};base64,${b64}" alt="${result.filename}" />`
      );
    }
  });
});

app.post("/upload", upload.single("image"), (req, res) => {
  const newImage = new ImageModel({
    data: fs.readFileSync(path.join(__dirname, "uploads", req.file.filename)),
    filename: req.file.filename,
    contentType: "image/" + path.extname(req.file.filename).substring(1),
  });
  newImage.save((err) => {
    if (err) console.log(err);
  });
  let response = "<p>Upload Success</p>";
  response += "<a href='/'>Home</a>";
  response += `<img src='/${req.file.filename}' alt='${req.file.filename}' />`;
  res.send(response);
});

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
