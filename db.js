const spicedPg = require("spiced-pg");
const database = "image-project";
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/image-project"
);

console.log("i am connecting:", database);

module.exports.getImages = function () {
    return db.query(
        `SELECT *
        FROM images
        ORDER BY created_at DESC;
        `
    );
};

module.exports.uploadImages = function (url, title, username, description) {
    return db
        .query(
            `INSERT INTO images
        (url, title, username,  description)
        VALUES ($1, $2, $3, $4)
        returning *;`,
            [url, username, title, description]
        )
        .then(function (results) {
            return results.rows;
        });
};
