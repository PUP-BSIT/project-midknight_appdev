const db = require("../config/db");

const getArtWorks = (id, callback) => {    
    const query = `SELECT * FROM artworks WHERE user_id = ? AND status = 1`    
    db.query(query, [id], (err, results) => {
        if (err) {
            return callback(err, null);
        }        
        if (results.length === 0) {       
            return callback(null, null);
        }    
        return callback(null, results);
    });
}

const getArtworkByTitleAndId = (title, id, callback) => {
  const query = `
    SELECT 
      a.artwork_id, a.user_id, a.title, a.description, a.date_created, a.image_url,
      u.first_name, u.last_name
    FROM 
      artworks a
    JOIN 
      user_information u ON a.user_id = u.user_information_id
    WHERE 
      a.title = ? AND a.artwork_id = ?
  `;
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

const removeArtwork = (artwork_id, callback) => {
  const query = "UPDATE artworks SET status = 0 WHERE artwork_id = ?";
  db.query(query, [artwork_id], (error, results) => {
    if (error) {
      return callback(error);
    }
    return callback(null, 'Artwork deleted successfully');
  });
};

const addArtWork = (userId, title, details, date, imageUrl, callback) => {
  const query = `INSERT INTO artworks (user_id, title, description, date_created, image_url, status) VALUES (?, ?, ?, ?, ?, 1)`;
  db.query(query, [userId, title, details, date, imageUrl], (err, result) => {
    if (err) {
      console.error('Error inserting artwork:', err);
      return callback(err);
    }
    return callback(null, 'Artwork deleted successfully');  
    
  });
}



module.exports = {
    getArtWorks,
    getArtworkByTitleAndId,
    removeArtwork,
    addArtWork
};