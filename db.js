const spicedPg = require("spiced-pg");
const database = "image-project";
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/image-project"
);

console.log("i am connecting:", database);

module.exports.getImages = function (smallestImageId) {
    const q = `SELECT url, title, created_at AS date, id,
                        (SELECT id FROM images
                        ORDER BY id ASC
                        LIMIT 1) AS "lowestId"
                    FROM images
                    ${smallestImageId ? "WHERE id < $1" : ""}
                    ORDER BY created_at DESC
                    LIMIT 9`;
    return db.query(q, smallestImageId && [smallestImageId]);
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
            return results;
        });
};

// to get image info by id
module.exports.getImageById = function (id) {
    const query = `SELECT url, title, description, username, created_at AS date,
                        (SELECT id FROM images
                        WHERE id < $1
                        ORDER BY id DESC
                        LIMIT 1) AS "prevId",
                        (SELECT id FROM images
                        WHERE id > $1
                        LIMIT 1) AS "nextId"
                    FROM images
                    WHERE id = $1`;
    return db.query(query, [id]);
};

module.exports.getComments = function (selectedImageId) {
    const q = `SELECT username, comment, created_at AS date
                    FROM comments
                    WHERE image_id = $1
                    ORDER BY created_at DESC`;
    return db.query(q, [selectedImageId]);
};

module.exports.addComment = function (selectedImageId, comment, username) {
    return db.query(
        `INSERT INTO comments
        (image_id, comment, username)
        VALUES ($1, $2, $3) 
        RETURNING *
        `,
        [selectedImageId, comment, username]
    );
};
