import React, { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { useNavigate } from "react-router-dom";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../services/api";
import "./folders.css";

function Folders() {
  const navigate = useNavigate();

  const { notes, removeFolderFromNotes } = useNotes();

  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  // Load folders from the backend.
  const loadFolders = async () => {
    try {
      const backendFolders = await getFolders();
      setFolders(backendFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  // Create a new folder.
  const handleCreateFolder = async () => {
    const name = folderName.trim();

    if (!name) {
      alert("Please enter a folder name.");
      return;
    }

    try {
      const newFolder = await createFolder({ name });

      setFolders((prevFolders) => [
        ...prevFolders,
        newFolder,
      ]);

      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Unable to create folder. Please try again.");
    }
  };

  // Update the selected folder name.
  const handleRenameFolder = async (folderId) => {
    const newName = editingFolderName.trim();

    if (!newName) {
      alert("Please enter a folder name.");
      return;
    }

    try {
      const updatedFolder = await updateFolder(folderId, {
        name: newName,
      });

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder._id === folderId ? updatedFolder : folder
        )
      );

      setEditingFolderId(null);
      setEditingFolderName("");
    } catch (error) {
      console.error("Error renaming folder:", error);
      alert("Unable to rename folder. Please try again.");
    }
  };

  // Delete the folder and remove its reference from related notes.
  const handleDeleteFolder = async (folderId) => {
    const confirmed = window.confirm(
      "Delete this folder? Notes inside it will remain, but they will be removed from this folder."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFolder(folderId);
      await removeFolderFromNotes(folderId);

      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder._id !== folderId)
      );
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Unable to delete folder. Please try again.");
    }
  };

  return (
    <main className="folders-page">
      <div className="folders-container">
        <div className="folders-header">
          <div>
            <h1>Folders</h1>
            <p>Organize your notes into folders.</p>
          </div>

          <div className="create-folder-box">
            <input
              type="text"
              placeholder="Folder name"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
            />

            <button onClick={handleCreateFolder}>
              + Create Folder
            </button>
          </div>
        </div>

        <section className="folders-grid">
          {folders.map((folder) => {
            // Count notes that belong to this folder.
            const noteCount = notes.filter(
              (note) => note.folderId === folder._id
            ).length;

            return (
              <article
                className="folder-card"
                key={folder._id}
                onClick={() => navigate(`/folders/${folder._id}`)}
              >
                <div className="folder-card-top">
                  <div className="folder-icon">📁</div>

                  <div className="folder-card-actions">
                    <button
                      className="folder-edit-btn"
                      onClick={(event) => {
                        event.stopPropagation();

                        setEditingFolderId(folder._id);
                        setEditingFolderName(folder.name);
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      className="folder-delete-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteFolder(folder._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {editingFolderId === folder._id ? (
                  <div className="folder-rename-box">
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(event) =>
                        setEditingFolderName(event.target.value)
                      }
                      onClick={(event) => event.stopPropagation()}
                    />

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRenameFolder(folder._id);
                      }}
                    >
                      Save
                    </button>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();

                        setEditingFolderId(null);
                        setEditingFolderName("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3>{folder.name}</h3>
                )}

                <p>
                  {noteCount} {noteCount === 1 ? "note" : "notes"}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export default Folders;