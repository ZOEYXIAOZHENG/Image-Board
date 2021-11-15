const spicedPg = require("spiced-pg");
const database = "image-project";
const db = spicedPg("postgres:postgres:postgres@localhost:5432/image-project");

console.log("I am connecting to:", database);

exports.getImages = function () {
    return db
        .query(
            `SELECT *
        FROM images
        ORDER BY created_at DESC;
        `
        )
        .then(function (results) {
            return results.rows;
        });
};
