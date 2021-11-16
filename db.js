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
