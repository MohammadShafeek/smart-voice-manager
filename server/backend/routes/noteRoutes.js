const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      userId: req.user.userId,
    };

    const note = new Note(noteData);

    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
});

// Get only logged-in user's notes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
});

// Get one note only if it belongs to logged-in user
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);

    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
});

// Update only logged-in user's note
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
});

// Delete only logged-in user's note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (error) {
    console.error("Error deleting note:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
});

module.exports = router;