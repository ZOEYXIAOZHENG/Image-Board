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
        ORDER BY created_at DESC 
        LIMIT 9;
        `
    );
};

module.exports.uploadImages = function (url, title, username, description) {
    return db
        .query(
            `INSERT INTO images
        (url, title, username, description)
        VALUES ($1, $2, $3, $4)
        returning *;`,
            [url, username, title, description]
        )
        .then(function (results) {
            return results.rows;
        });
};

// to get image info by id
module.exports.getImageById = function (id) {
    return db.query(`SELECT * FROM images WHERE id = ${id}`);
};

module.exports.getMoreImages = function (startId, offset) {
    return db
        .query(
            `SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 9
    OFFSET $2`,
            [startId, offset]
        )
        .then(({ rows }) => rows);
};

module.exports.getComments = function (id) {
    return db
        .query(
            `SELECT *
        FROM comments
        WHERE image_id = $1;
        `,
            [id]
        )
        .then(function (results) {
            return results.rows;
        });
};

module.exports.addComment = function (id, comment, username) {
    return db.query(
        `INSERT INTO comments
        (comment, username, image_id)
        VALUES ($1, $2, $3)
        `,
        [comment, username, id]
    );
};
