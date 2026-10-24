import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import "./NoteCard.css";

function NoteCard({
  note,
  editingNoteId,
  editTitle,
  setEditTitle,
  setEditingNoteId,
  startEditing,
  saveEditedNote,
  editContent,
  setEditContent,
  deleteNote,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const { updateNoteFolder, updateNoteTags, folders } = useNotes();

  const noteDate = new Date(note.createdAt);

  // Tags are currently stored in localStorage.
  const tags = JSON.parse(localStorage.getItem("tags") || "[]");

  const formattedDate = noteDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Text notes do not have a duration, so only calculate it for audio notes.
  const formattedDuration =
    note.type === "text"
      ? null
      : `${String(Math.floor(note.duration / 60)).padStart(2, "0")}:${String(
          note.duration % 60,
        ).padStart(2, "0")}`;

  // Store selected tag IDs so we can check which tags belong to this note.
  const selectedTagIds = note.tagIds || [];

  // Add or remove a tag from the current note.
  const handleTagChange = (tagId) => {
    const normalizedTagId = String(tagId);

    // Convert all IDs to strings so comparison works even if their types differ.
    const normalizedSelectedTagIds = selectedTagIds.map((id) => String(id));

    const alreadySelected =
      normalizedSelectedTagIds.includes(normalizedTagId);

    let updatedTagIds;

    if (alreadySelected) {
      updatedTagIds = normalizedSelectedTagIds.filter(
        (id) => id !== normalizedTagId,
      );
    } else {
      updatedTagIds = [...normalizedSelectedTagIds, normalizedTagId];
    }

    updateNoteTags(note._id, updatedTagIds);
  };

  return (
    <article
      className="note-card"
      onClick={() => {
        // Do not open the note while the user is editing it.
        if (editingNoteId !== note._id) {
          navigate(`/note/${note._id}`);
        }
      }}
    >
      <div className="note-card-header">
        <div className="note-card-title-area">
          <div className="note-card-icon">
            {note.type === "text" ? "📝" : "🎙️"}
          </div>

          <div className="note-card-heading">
            <h3>{note.title}</h3>

            <div className="note-card-meta">
              <span>{formattedDate}</span>

              {formattedDuration && (
                <>
                  <span>•</span>
                  <span>{formattedDuration}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="note-card-menu">
          <button
            className="note-card-menu-btn"
            onClick={(event) => {
              // Prevent the card click from opening the note.
              event.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
          >
            ⋮
          </button>

          {showMenu && (
            <div
              className="note-card-dropdown"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => {
                  startEditing(note);

                  setEditContent(note.content || "");

                  setShowMenu(false);
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => {
                  deleteNote(note._id);

                  setShowMenu(false);
                }}
              >
                🗑️ Delete
              </button>

              <div className="move-folder-section">
                <label htmlFor={`folder-${note._id}`}>
                  Move to Folder
                </label>

                <select
                  id={`folder-${note._id}`}
                  value={note.folderId || ""}
                  onChange={(event) => {
                    const selectedFolderId = event.target.value;

                    if (!selectedFolderId) {
                      return;
                    }

                    updateNoteFolder(note._id, selectedFolderId);

                    setShowMenu(false);
                  }}
                >
                  <option value="">Select folder</option>

                  {folders.map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      📁 {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="note-tags-section">
                <label>Tags</label>

                {tags.length === 0 ? (
                  <p className="no-tags-message">No tags available</p>
                ) : (
                  <div className="note-tags-list">
                    {tags.map((tag) => (
                      <label className="note-tag-option" key={tag.id}>
                        <input
                          type="checkbox"
                          checked={selectedTagIds
                            .map((id) => String(id))
                            .includes(String(tag.id))}
                          onChange={() => handleTagChange(tag.id)}
                        />

                        <span>#{tag.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {editingNoteId === note._id ? (
        <div className="note-card-edit-area">
          <input
            className="note-card-edit-input"
            type="text"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />

          {note.type === "text" && (
            <textarea
              className="note-card-edit-content"
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              rows="8"
              placeholder="Write your note here..."
            />
          )}

          <div className="note-card-edit-actions">
            <button
              className="note-card-save-btn"
              onClick={() => saveEditedNote(note._id, note.type)}
            >
              Save
            </button>

            <button
              className="note-card-cancel-btn"
              onClick={() => {
                setEditingNoteId(null);
                setEditTitle("");
                setEditContent("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {note.type === "text" ? (
            <div className="note-card-text">
              <div className="note-card-text-title">Note Content</div>

              <p>{note.content}</p>
            </div>
          ) : (
            <>
              <div className="note-card-audio-wrapper">
                <audio
                  className="note-card-audio"
                  controls
                  src={note.audioUrl}
                  onClick={(event) => event.stopPropagation()}
                />
              </div>

              {note.transcript && (
                <div className="note-card-transcript">
                  <div className="note-card-transcript-title">
                    Transcript
                  </div>

                  <p>{note.transcript}</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedTagIds.length > 0 && (
        <div className="note-card-selected-tags">
          {tags
            .filter((tag) =>
              selectedTagIds
                .map((id) => String(id))
                .includes(String(tag.id)),
            )
            .map((tag) => (
              <span className="note-card-tag" key={tag.id}>
                #{tag.name}
              </span>
            ))}
        </div>
      )}
    </article>
  );
}

export default NoteCard;
