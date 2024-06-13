const db = require("../config/db");

const getArtWorks = (id, callback) => {    
    const query = `SELECT * FROM artworks WHERE user_id = ?`    
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
  const query = 'SELECT artwork_id, user_id, title, description, date_created, image_url FROM artworks WHERE title = ? AND artwork_id = ?';
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


module.exports = {
    getArtWorks,
    getArtworkByTitleAndId
};
