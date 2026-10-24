const express = require("express");
const Folder = require("../models/Folder");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create folder
router.post("/", authMiddleware, async (req, res) => {
  try {
    const folder = new Folder({
      name: req.body.name,
      userId: req.user.userId,
    });

    await folder.save();

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);

    res.status(500).json({
      message: "Failed to create folder",
    });
  }
});

// Get only logged-in user's folders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const folders = await Folder.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);

    res.status(500).json({
      message: "Failed to fetch folders",
    });
  }
});

// Get one folder only if it belongs to logged-in user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);

    res.status(500).json({
      message: "Failed to fetch folder",
    });
  }
});

// Update only logged-in user's folder
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedFolder = await Folder.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        name: req.body.name,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedFolder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error);

    res.status(500).json({
      message: "Failed to update folder",
    });
  }
});

// Delete only logged-in user's folder
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedFolder = await Folder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedFolder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    res.status(200).json({
      message: "Folder deleted successfully",
      folder: deletedFolder,
    });
  } catch (error) {
    console.error("Error deleting folder:", error);

    res.status(500).json({
      message: "Failed to delete folder",
    });
  }
});

module.exports = router;