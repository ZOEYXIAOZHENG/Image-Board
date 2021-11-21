const express = require("express");
const app = express();
const db = require("./db.js");
const moment = require("moment");

const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const path = require("path");

app.use(express.static("./public"));
app.use(express.json());

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "upload"));
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

//---------------------------  ROUTE  ------------------------------

app.get("/images.json", (req, res) => {
    db.getImages()
        .then((images) => {
            return res.json(images);
        })
        .catch((err) => {
            console.log("err in GET/images.json:", err);
            res.sendStatus(500);
        });
});

// When user clicks the submit button, a POST request containing all of the data should be made.
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log(req.body);
    console.log("our file will be reachable at its bucket's url");
    const aws = "https://s3.amazonaws.com/";
    const bucket = "spicedling/";
    const filename = req.file.filename;
    const url = `${aws}${bucket}${filename}`;

    db.uploadImages(
        url,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then((images) => {
            images.rows[0].publDate = moment(
                images.rows[0].created_at
            ).fromNow();
            res.json(images.rows[0]);
        })
        .catch((err) => {
            console.log("error in uploading images:", err);
            res.sendStatus(500);
        });
});

app.get("/image/:id", (req, res) => {
    const { id } = req.params;

    db.getImageById(id)
        .then((image) => {
            if (image.rows.length !== 0) {
                image.rows[0].publDate = moment(image.rows[0].date).fromNow();
            }
            // we want to send back the newly uploaded image object to our client side
            return res.json(image);
        })
        .catch((err) => {
            console.log("err in getImageById() on GET /selected-image/id", err);
            res.sendStatus(500);
        });
});

app.get("/more-images/:smallestImageId", (req, res) => {
    const { smallestImageId } = req.params;
    db.getImages(smallestImageId)
        .then((images) => {
            return res.json(images);
        })
        .catch((err) => {
            console.log("err in getMoreImages() on GET /more-images/", err);
            res.sendStatus(500);
        });
});

app.get("/comments/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getComments(imageId)
        .then((comments) => {
            return res.json(comments);
        })
        .catch((err) => {
            console.log("err in getComments() on GET /comments.json", err);
            res.sendStatus(500);
        });
});

app.post("/comments", (req, res) => {
    const { imageId, username, comment } = req.body;

    db.addComment(imageId, username, comment)
        .then((comment) => {
            res.json(comment.rows[0]);
        })
        .catch((err) => {
            console.log("err in addComment on POST /add-comment", err);
            res.sendStatus(500);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log("I'm listening."));
