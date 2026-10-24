import React, { useState } from "react";
import NoteCard from "../components/NoteCard";
import { useNotes } from "../context/NotesContext";
import "./mynotes.css";

function MyNotes() {
  const {
    notes,
    folders,
    deleteNote,
    updateNote,
    searchQuery,
    setSearchQuery,
  } = useNotes();

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");
  const [folderFilter, setFolderFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  // Tags are currently stored in localStorage.
  const [tags] = useState(() => {
    return JSON.parse(localStorage.getItem("tags") || "[]");
  });

  // Open edit mode for the selected note.
  const startEditing = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.type === "text" ? note.content || "" : "");
  };

  // Validate and save the edited note.
  const saveEditedNote = async (noteId, noteType) => {
    if (!editTitle.trim()) {
      alert("Title cannot be empty.");
      return;
    }

    if (noteType === "text" && !editContent.trim()) {
      alert("Note content cannot be empty.");
      return;
    }

    try {
      const noteData = {
        title: editTitle.trim(),
      };

      if (noteType === "text") {
        noteData.content = editContent.trim();
      }

      await updateNote(noteId, noteData);

      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  // Apply search, type, folder, and tag filters.
  const filteredNotes = notes.filter((note) => {
    const searchText = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      note.title?.toLowerCase().includes(searchText) ||
      note.content?.toLowerCase().includes(searchText) ||
      note.transcript?.toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "all" || note.type === typeFilter;

    const matchesFolder =
      folderFilter === "all" ||
      String(note.folderId) === String(folderFilter);

    const matchesTag =
      tagFilter === "all" ||
      (note.tagIds || [])
        .map((id) => String(id))
        .includes(String(tagFilter));

    return (
      matchesSearch &&
      matchesType &&
      matchesFolder &&
      matchesTag
    );
  });

  // Reset the search box and all filters.
  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setFolderFilter("all");
    setTagFilter("all");
  };

  return (
    <main className="my-notes-page">
      <div className="my-notes-container">
        <div className="my-notes-header">
          <div>
            <h1>My Notes</h1>
            <p>Search and organize all your notes</p>
          </div>
        </div>

        {notes.length > 0 && (
          <section className="notes-filter-section">
            <div className="notes-search-box">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                placeholder="Search by title, content or transcript..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />
            </div>

            <div className="notes-filter-row">
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                <option value="all">All Types</option>
                <option value="voice">🎙️ Voice Notes</option>
                <option value="text">📝 Text Notes</option>
              </select>

              <select
                value={folderFilter}
                onChange={(event) =>
                  setFolderFilter(event.target.value)
                }
              >
                <option value="all">All Folders</option>

                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    📁 {folder.name}
                  </option>
                ))}
              </select>

              <select
                value={tagFilter}
                onChange={(event) =>
                  setTagFilter(event.target.value)
                }
              >
                <option value="all">All Tags</option>

                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    🏷️ {tag.name}
                  </option>
                ))}
              </select>

              {(searchQuery ||
                typeFilter !== "all" ||
                folderFilter !== "all" ||
                tagFilter !== "all") && (
                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="notes-result-info">
              Showing <strong>{filteredNotes.length}</strong> of{" "}
              <strong>{notes.length}</strong> notes
            </div>
          </section>
        )}

        {notes.length > 0 ? (
          filteredNotes.length > 0 ? (
            <div className="my-notes-list">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  editingNoteId={editingNoteId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  setEditingNoteId={setEditingNoteId}
                  startEditing={startEditing}
                  saveEditedNote={saveEditedNote}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  deleteNote={deleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="empty-notes">
              <div className="empty-icon">🔍</div>

              <h2>No matching notes found</h2>

              <p>
                Try a different search or clear the filters.
              </p>

              <button
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )
        ) : (
          <div className="empty-notes">
            <div className="empty-icon">🎙️</div>

            <h2>No notes yet</h2>

            <p>
              Start recording or create your first note to see it
              here.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default MyNotes;