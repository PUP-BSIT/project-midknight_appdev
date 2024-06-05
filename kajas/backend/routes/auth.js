const express = require("express");
const {
  signup,
  verifyAccount,
  login,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyAccount);
router.post("/login", login);
module.exports = router;
