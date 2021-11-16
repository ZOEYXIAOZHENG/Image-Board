const aws = require("aws-sdk");
const { AWS_SECRET, AWS_KEY } = require("./secrets");
const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
}); // is an instance of an AWS user -> it's yet another object,
// with methods on it! and it will allow us to communicate
// with AWS S3, i.e. upload files :D

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
        .promise();
    promise
        .then(() => {
            console.log("yayyyyy our image is in the cloud!! ☁️");
            next();
            // once my image in the cloud I don't need to store
            // it in uploads anymore!
            fs.unlink(path, () => console.log("file removed"));
        })
        .catch((err) => {
            console.log("oooppps sth wrong with cloud upload", err);
            return res.sendStatus(500);
        });
};
