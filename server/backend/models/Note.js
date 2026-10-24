const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["voice", "upload", "text"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    transcript: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      default: 0,
    },

    folderId: {
      type: String,
      default: null,
    },

    tagIds: {
      type: [String],
      default: [],
    },

    // Store the user who owns this note.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);