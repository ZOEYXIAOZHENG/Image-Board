const aws = require("aws-sdk");
const { AWS_SECRET, AWS_KEY } = require("./secrets");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
}); // is an instance of an AWS user 

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on server !!!📍");
        // no file on request, means sth went wrong with multer,
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // it return a promise

    promise
        .then(() => {
            // it worked!
            console.log("yayyyyy our image is in the cloud!! ☁️");
            next();
            // once my image in the cloud I don't need to store it in uploads anymore.
            fs.unlink(path, () => console.log("file removed"));
        })
        .catch((err) => {
            console.log("oooppps sth wrong in uploading to s3", err);
            return res.sendStatus(500);
        });
};
