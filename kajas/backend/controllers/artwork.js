const db = require("../config/db");

const getArtWorks = (id, callback) => {
  const query = `SELECT * FROM artworks WHERE user_id = ?`;
  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    return callback(null, results);
  });
};

const getArtworkByTitleAndId = (title, id, callback) => {
  const query = `SELECT a.artwork_id, a.user_id, a.title, a.description, a.date_created, a.image_url, u.first_name, u.last_name
                   FROM artworks a
                   JOIN user_information u ON a.user_id = u.user_information_id
                   WHERE a.title = ? AND a.artwork_id = ?`;
  db.query(query, [title, id], (error, results) => {
    if (error) {
      return callback(error);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
};

const addArtwork = (artwork, callback) => {
  const query = `INSERT INTO artworks (user_id, title, description, date_created, image_url)
                   VALUES (?, ?, ?, ?, ?)`;
  const values = [
    artwork.user_id,
    artwork.title,
    artwork.description,
    artwork.date_created,
    artwork.image_url,
  ];
  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error inserting artwork:", error);
      return callback(error);
    }
    callback(null, results.insertId);
  });
};

const getArtworkById = (artworkId, callback) => {
  const query = "SELECT * FROM artworks WHERE artwork_id = ?";
  db.query(query, [artworkId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    const artwork = results[0];
    artwork.image_url = `http://localhost:4000/uploads/${artwork.image_url}`;
    return callback(null, artwork);
  });
};

const updateArtwork = (artworkId, updatedFields, callback) => {
  const queryParts = [];
  const values = [];

  Object.keys(updatedFields).forEach((key) => {
    queryParts.push(`${key} = ?`);
    values.push(updatedFields[key]);
  });

  values.push(artworkId);

  const query = `UPDATE artworks SET ${queryParts.join(
    ", "
  )} WHERE artwork_id = ?`;

  db.query(query, values, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results);
  });
};

module.exports = {
  getArtWorks,
  getArtworkByTitleAndId,
  addArtwork,
  getArtworkById,
  updateArtwork,
};
