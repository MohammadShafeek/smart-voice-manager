import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import "./createtextnote.css";

function CreateTextNote() {
  const navigate = useNavigate();

  const { addNote, updateNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState(null);

  const [autoSave, setAutoSave] = useState(() => {
    const savedSettings = localStorage.getItem("settings");

    if (!savedSettings) return true;

    const parsedSettings = JSON.parse(savedSettings);

    return parsedSettings.autoSave ?? true;
  });

  // Save the note automatically after the user stops typing.
  useEffect(() => {
    if (!autoSave) return;

    if (!title.trim() || !content.trim()) return;

    const timer = setTimeout(async () => {
      const textNote = {
        title: title.trim(),
        content: content.trim(),
        type: "text",
      };

      try {
        if (!noteId) {
          const savedNote = await addNote(textNote);

          setNoteId(savedNote._id);

          console.log("Auto Save: New note created.");
        } else {
          await updateNote(noteId, textNote);

          console.log("Auto Save: Note updated.");
        }
      } catch (error) {
        console.error("Auto Save failed:", error);
      }
    }, 1500);

    // Clear the previous timer when the user types again.
    return () => clearTimeout(timer);
  }, [title, content, autoSave, noteId]);

  // Save the note manually when Auto Save is turned off.
  const handleSaveNote = async () => {
    if (!title.trim()) {
      alert("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      alert("Please write something in your note.");
      return;
    }

    const textNote = {
      title: title.trim(),
      content: content.trim(),
      type: "text",
    };

    try {
      if (noteId) {
        await updateNote(noteId, textNote);

        console.log("Text note updated successfully.");
      } else {
        const savedNote = await addNote(textNote);

        setNoteId(savedNote._id);

        console.log("Text note saved successfully.");
      }

      navigate("/notes");
    } catch (error) {
      console.error("Error saving text note:", error);

      alert("Unable to save note. Please try again.");
    }
  };

  return (
    <main className="create-text-note-page">
      <div className="create-text-note-container">
        <div className="create-text-note-header">
          <h1>Create Text Note</h1>
          <p>Write down your thoughts and ideas.</p>
        </div>

        <section className="create-text-note-card">
          <div className="text-note-field">
            <label>Note Title</label>

            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="text-note-field">
            <label>Note Content</label>

            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
            />
          </div>

          <div className="text-note-actions">
            <button
              className="cancel-text-note-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              className="save-text-note-btn"
              onClick={handleSaveNote}
            >
              Save Note
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CreateTextNote;