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

module.exports = {
    getArtWorks
};
  