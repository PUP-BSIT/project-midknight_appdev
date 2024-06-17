const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const artworkController = require("../controllers/artwork");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/addArtwork", upload.single("image"), (req, res) => {
  const artwork = {
    user_id: req.body.user_id,
    title: req.body.title,
    description: req.body.details,
    date_created: req.body.date,
    image_url: req.file.path,
  };

  artworkController.addArtwork(artwork, (error, artworkId) => {
    if (error) {
      return res.status(500).json({ message: "Error adding artwork", error });
    }
    res.status(200).json({ message: "Artwork added successfully", artworkId });
  });
});

router.get("/artwork/:artworkId/:userId", (req, res) => {
  const { artworkId, userId } = req.params;
  artworkController.getArtworkById(artworkId, (err, artwork) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    if (artwork.user_id !== parseInt(userId, 10)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json(artwork);
  });
});

router.put("/artwork/:artworkId", (req, res) => {
  const { artworkId } = req.params;
  const updatedFields = req.body;

  artworkController.updateArtwork(artworkId, updatedFields, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
    res.status(200).json({ message: "Artwork updated successfully", result });
  });
});

module.exports = router;
