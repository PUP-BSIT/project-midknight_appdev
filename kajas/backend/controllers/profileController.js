const User = require("../models/User");
const { updateUserInformation } = require("../models/UserInformation");
const {
  getArtworkByTitleAndId,
  getArtWorks,
  removeArtwork,
  addArtWork,
} = require("../models/Artworks");
const { query } = require("express");
const path = require("path");

const getProfile = (req, res) => {
  const { username } = req.params;

  User.getUserProfile(username, (err, profile) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(profile);
  });
};

const getLocation = async (req, res) => {
  const { id } = req.query;

  User.getLocation(id, (error, result) => {
    if (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!result) {
      return res.status(200).json({
        isFirstTimeLogin: 1,
      });
    }
    res.status(200).json({ isFirstTimeLogin: 0 });
  });
};

const setupProfile = async (req, res) => {
  try {
    const profile = req.file ? path.basename(req.file.path) : null;
    const {
      id,
      bio,
      kajas_link,
      country,
      city,
      facebook,
      linkedIn,
      instagram,
      website,
      firstName,
      middleName,
      lastName,
    } = req.body;

    updateUserInformation(
      id,
      profile,
      bio,
      kajas_link,
      country,
      city,
      facebook,
      linkedIn,
      instagram,
      website,
      firstName,
      middleName,
      lastName,
      (error, result) => {
        if (error) {
          console.error("Error updating user information:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    );

    const username = kajas_link;
    User.updateUsername(id, username, (error, result) => {
      if (error) {
        console.error("Error updating username:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

    res.status(200).json({ updatedprofile: profile, message: "Success!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGallery = async (req, res) => {
  try {
    const { id } = req.query;

    getArtWorks(id, (error, result) => {
      if (error) {
        console.error("Error fetching artworks:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!result) {
        return res.status(200).json({
          message: "No Artworks Yet...",
          data: [],
        });
      }
      res.status(200).json({
        message: "Artworks Fetched Successfully",
        data: result,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getArtworkDetailsByTitleAndId = (req, res) => {
  const { title, id } = req.params;
  const formattedTitle = title.split("-").join(" ");

  getArtworkByTitleAndId(formattedTitle, id, (error, result) => {
    if (error) {
      console.error("Error fetching artwork details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!result) {
      return res.status(404).json({ message: "Artwork not found" });
    }
    res.status(200).json(result);
  });
};

const deleteAnArtwork = (req, res) => {
  const { artwork_id } = req.params;

  removeArtwork(artwork_id, (error, result) => {
    if (error) {
      console.error("Error deleting artwork:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(result);
  });
};

const submitArtwork = (req, res) => {
  const { title, date, details, userId } = req.body;
  const imageUrl = req.file ? path.basename(req.file.path) : null;
  if (!title || !date || !details || !imageUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }
  addArtWork(userId, title, details, date, imageUrl, (error, result) => {
    if (error) {
      console.error("Error inserting artwork:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Artwork added successfully" });
  });
};

module.exports = {
  getProfile,
  getLocation,
  setupProfile,
  getGallery,
  getArtworkDetailsByTitleAndId,
  deleteAnArtwork,
  submitArtwork,
};
