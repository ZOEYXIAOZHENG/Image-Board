const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));

app.use(express.json());

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/images", (req, res) => {
    console.log("request to images was made");
    db.getImages()
        .then((images) => {
            res.json(images);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(8080, () => console.log(`I'm listening.`));
