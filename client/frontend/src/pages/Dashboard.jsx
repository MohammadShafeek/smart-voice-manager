import React, { useEffect, useState } from "react";
import { getFolders } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  FileText,
  Folder,
  Plus,
  ArrowRight,
} from "lucide-react";

import { useNotes } from "../context/NotesContext";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { notes } = useNotes();

  const [folders, setFolders] = useState([]);

  // Load folders from the backend for the dashboard count.
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const backendFolders = await getFolders();
        setFolders(backendFolders);
      } catch (error) {
        console.error("Error loading folders:", error);
      }
    };

    loadFolders();
  }, []);

  // Separate voice and text notes for the dashboard stats.
  const voiceNotes = notes.filter(
    (note) => note.type !== "text"
  );

  const textNotes = notes.filter(
    (note) => note.type === "text"
  );

  // Sort notes by newest first and show only the latest 5.
  const recentNotes = [...notes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <div>
            <h1>Welcome to Smart Voice Manager</h1>

            <p>
              Manage your voice and text notes
              in one place.
            </p>
          </div>

          <button
            className="dashboard-record-btn"
            onClick={() => navigate("/record")}
          >
            <Mic size={18} />
            Record Note
          </button>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon voice">
              <Mic size={22} />
            </div>

            <div>
              <span>Voice Notes</span>
              <strong>{voiceNotes.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon text">
              <FileText size={22} />
            </div>

            <div>
              <span>Text Notes</span>
              <strong>{textNotes.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon folder">
              <Folder size={22} />
            </div>

            <div>
              <span>Folders</span>
              <strong>{folders.length}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon total">
              <FileText size={22} />
            </div>

            <div>
              <span>Total Notes</span>
              <strong>{notes.length}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Create something new</p>
            </div>
          </div>

          <div className="dashboard-quick-actions">
            <button onClick={() => navigate("/record")}>
              <Mic size={22} />

              <div>
                <strong>Record Voice Note</strong>
                <span>Record your thoughts</span>
              </div>

              <ArrowRight size={18} />
            </button>

            <button onClick={() => navigate("/create-note")}>
              <FileText size={22} />

              <div>
                <strong>Create Text Note</strong>
                <span>Write a new note</span>
              </div>

              <ArrowRight size={18} />
            </button>

            <button onClick={() => navigate("/upload-audio")}>
              <Plus size={22} />

              <div>
                <strong>Upload Audio</strong>
                <span>Add an existing recording</span>
              </div>

              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h2>Recent Notes</h2>
              <p>Your latest notes</p>
            </div>

            {notes.length > 0 && (
              <button
                className="view-all-btn"
                onClick={() => navigate("/notes")}
              >
                View All
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          {recentNotes.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                <FileText size={28} />
              </div>

              <h3>No notes yet</h3>

              <p>
                Start by recording a voice
                note or creating a text note.
              </p>

              <button onClick={() => navigate("/record")}>
                <Mic size={17} />
                Create First Note
              </button>
            </div>
          ) : (
            <div className="dashboard-recent-list">
              {recentNotes.map((note) => (
                <article
                  className="dashboard-recent-card"
                  key={note._id}
                  onClick={() =>
                    navigate(`/note/${note._id}`)
                  }
                >
                  <div className="dashboard-recent-icon">
                    {note.type === "text" ? (
                      <FileText size={19} />
                    ) : (
                      <Mic size={19} />
                    )}
                  </div>

                  <div className="dashboard-recent-info">
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

                  <ArrowRight
                    size={18}
                    className="dashboard-recent-arrow"
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;