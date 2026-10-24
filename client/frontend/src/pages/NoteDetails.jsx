import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mic,
  Trash2,
  Edit3,
  FileText,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";
import "./notedetails.css";

function NoteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { notes, deleteNote, updateNote } = useNotes();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Find the note using the ID from the URL.
  const note = notes.find(
    (item) => String(item._id) === String(id)
  );

  if (!note) {
    return (
      <main className="note-details-page">
        <div className="note-not-found">
          <h2>Note not found</h2>

          <button onClick={() => navigate("/notes")}>
            Back to My Notes
          </button>
        </div>
      </main>
    );
  }

  const noteDate = new Date(note.createdAt);

  const formattedDate = noteDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = noteDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Text notes do not have a duration.
  const formattedDuration =
    note.type === "text"
      ? null
      : `${String(Math.floor(note.duration / 60)).padStart(
          2,
          "0"
        )}:${String(note.duration % 60).padStart(2, "0")}`;

  // Load the current note data into the edit fields.
  const handleEditStart = () => {
    setEditTitle(note.title);

    if (note.type === "text") {
      setEditContent(note.content || "");
    } else {
      setEditContent("");
    }

    setIsEditing(true);
  };

  // Validate and save the edited note.
  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    if (note.type === "text" && !editContent.trim()) {
      alert("Note content cannot be empty.");
      return;
    }

    try {
      const noteData = {
        title: editTitle.trim(),
      };

      if (note.type === "text") {
        noteData.content = editContent.trim();
      }

      await updateNote(note._id, noteData);

      setIsEditing(false);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  // Ask for confirmation before deleting the note.
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    await deleteNote(note._id);
    navigate("/notes");
  };

  return (
    <main className="note-details-page">
      <div className="note-details-container">
        <button
          className="back-button"
          onClick={() => navigate("/notes")}
        >
          <ArrowLeft size={18} />
          Back to My Notes
        </button>

        <section className="note-details-card">
          <div className="note-details-header">
            <div className="note-details-title-section">
              <div className="note-details-icon">
                {note.type === "text" ? (
                  <FileText size={24} />
                ) : (
                  <Mic size={24} />
                )}
              </div>

              <div>
                {isEditing ? (
                  <input
                    className="note-details-edit-input"
                    type="text"
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                  />
                ) : (
                  <h1>{note.title}</h1>
                )}

                <div className="note-details-meta">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{formattedTime}</span>

                  {formattedDuration && (
                    <>
                      <span>•</span>
                      <span>{formattedDuration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="note-details-actions">
              {isEditing ? (
                <>
                  <button
                    className="save-note-button"
                    onClick={handleEditSave}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-note-button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle("");
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-note-button"
                    onClick={handleEditStart}
                  >
                    <Edit3 size={17} />
                    Edit
                  </button>

                  <button
                    className="delete-note-button"
                    onClick={handleDelete}
                  >
                    <Trash2 size={17} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {note.type === "text" ? (
            <div className="note-details-text">
              <h2>Note Content</h2>

              {isEditing ? (
                <textarea
                  className="note-details-content-editor"
                  value={editContent}
                  onChange={(event) =>
                    setEditContent(event.target.value)
                  }
                  rows="12"
                  placeholder="Write your note here..."
                />
              ) : (
                <p>{note.content}</p>
              )}
            </div>
          ) : (
            <>
              <div className="note-details-audio">
                <h2>Audio Recording</h2>

                <audio
                  controls
                  src={note.audioUrl}
                  className="details-audio-player"
                />
              </div>

              {note.transcript && (
                <div className="note-details-transcript">
                  <h2>Transcript</h2>
                  <p>{note.transcript}</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default NoteDetails;