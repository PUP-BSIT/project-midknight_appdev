const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const artworkController = require('../controllers/artwork');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/addArtwork', upload.single('image'), (req, res) => {
    console.log('Received request to add artwork:', req.body);
    console.log('File info:', req.file);

    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const artwork = {
        user_id: req.body.user_id,
        title: req.body.title,
        description: req.body.details,
        date_created: req.body.date,
        image_url: req.file.path
    };

    console.log('Artwork object to be inserted:', artwork);

    artworkController.addArtwork(artwork, (error, artworkId) => {
        if (error) {
            console.error('Error adding artwork:', error);
            return res.status(500).json({ message: 'Error adding artwork', error });
        }
        res.status(200).json({ message: 'Artwork added successfully', artworkId });
    });
});

module.exports = router;
