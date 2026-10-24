const express = require("express");
const multer = require("multer");

const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

// Store uploaded audio files inside the uploads folder.
const upload = multer({
  dest: "uploads/",
});

// Upload an audio file.
router.post(
  "/upload",
  authMiddleware,
  upload.single("audio"),
  (req, res) => {
    try {
      console.log("Uploaded file:", req.file);

      res.status(201).json({
        message: "Audio uploaded successfully",
        file: req.file,
      });
    } catch (error) {
      console.error(
        "Audio upload error:",
        error
      );

      res.status(500).json({
        message: "Failed to upload audio",
      });
    }
  }
);

module.exports = router;