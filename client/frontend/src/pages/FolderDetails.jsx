import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { getFolders } from "../services/api";
import "./folderdetails.css";

function FolderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { notes } = useNotes();

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const folderId = id;

  // Load folders so we can find the current folder.
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const backendFolders = await getFolders();
        setFolders(backendFolders);
      } catch (error) {
        console.error("Error loading folders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();
  }, []);

  const folder = folders.find(
    (folder) => folder._id === folderId
  );

  // Show only notes that belong to the current folder.
  const folderNotes = notes.filter(
    (note) => note.folderId === folderId
  );

  if (loading) {
    return (
      <main className="folder-details-page">
        <div className="folder-details-container">
          <h1>Loading folder...</h1>
        </div>
      </main>
    );
  }

  if (!folder) {
    return (
      <main className="folder-details-page">
        <div className="folder-details-container">
          <h1>Folder not found</h1>

          <button onClick={() => navigate("/folders")}>
            ← Back to Folders
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="folder-details-page">
      <div className="folder-details-container">
        <div className="folder-details-header">
          <button
            className="back-folder-btn"
            onClick={() => navigate("/folders")}
          >
            ← Back to Folders
          </button>

          <div className="folder-details-title">
            <div className="folder-details-icon">
              📁
            </div>

            <div>
              <h1>{folder.name}</h1>

              <p>
                {folderNotes.length}{" "}
                {folderNotes.length === 1
                  ? "note"
                  : "notes"}
              </p>
            </div>
          </div>
        </div>

        <section className="folder-notes-section">
          {folderNotes.length === 0 ? (
            <div className="empty-folder">
              <div className="empty-folder-icon">
                📂
              </div>

              <h2>No notes in this folder</h2>

              <p>
                Move a note to this folder and
                it will appear here.
              </p>
            </div>
          ) : (
            <div className="folder-notes-grid">
              {folderNotes.map((note) => (
                <article
                  className="folder-note-card"
                  key={note._id}
                  onClick={() =>
                    navigate(`/note/${note._id}`)
                  }
                >
                  <div className="folder-note-header">
                    <div className="folder-note-icon">
                      {note.type === "text"
                        ? "📝"
                        : "🎙️"}
                    </div>

                    <div>
                      <h3>{note.title}</h3>

                      <span>
                        {new Date(
                          note.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {note.type === "text" && (
                    <p className="folder-note-content">
                      {note.content}
                    </p>
                  )}

                  {note.type !== "text" && (
                    <div
                      className="folder-note-audio"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <audio
                        controls
                        src={note.audioUrl}
                      />
                    </div>
                  )}

                  {note.transcript && (
                    <div className="folder-note-transcript">
                      <strong>Transcript</strong>

                      <p>{note.transcript}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default FolderDetails; 