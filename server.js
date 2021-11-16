const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));
app.use(express.json());

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

app.get("/images.json", (req, res) => {
    console.log("request to images was made");
    db.getImages()
        .then((images) => {
            console.log(images.rows);
            res.json(images.rows);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// When user clicks the submit button, a POST request containing all of the data should be made.
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  
    if (req.file) {
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
