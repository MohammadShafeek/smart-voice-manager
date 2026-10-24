import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  FileText,
  Mic,
} from "lucide-react";

import { useNotes } from "../context/NotesContext";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../services/api";
import "./organize.css";

function Organize() {
  const navigate = useNavigate();

  const { notes, removeFolderFromNotes } = useNotes();

  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

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

  // Open rename mode for the selected folder.
  const handleStartRename = (folder) => {
    setEditingFolderId(folder._id);
    setEditingFolderName(folder.name);
    setOpenMenuId(null);
  };

  // Save the new folder name.
  const handleSaveRename = async (folderId) => {
    const newName = editingFolderName.trim();

    if (!newName) {
      alert("Folder name cannot be empty.");
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

  // Delete the folder and remove its reference from notes.
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

      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Unable to delete folder. Please try again.");
    }
  };

  // Count all notes assigned to a folder.
  const getFolderNoteCount = (folderId) => {
    return notes.filter(
      (note) => note.folderId === folderId
    ).length;
  };

  // Count voice notes in a folder.
  const getFolderVoiceCount = (folderId) => {
    return notes.filter(
      (note) =>
        note.folderId === folderId &&
        note.type !== "text"
    ).length;
  };

  // Count text notes in a folder.
  const getFolderTextCount = (folderId) => {
    return notes.filter(
      (note) =>
        note.folderId === folderId &&
        note.type === "text"
    ).length;
  };

  return (
    <main className="organize-page">
      <div className="organize-container">
        <section className="organize-header">
          <div>
            <h1>Organize</h1>
            <p>
              Manage your folders and organize your notes.
            </p>
          </div>
        </section>

        <section className="create-folder-section">
          <div className="create-folder-title">
            <Folder size={20} />

            <div>
              <h2>Create Folder</h2>
              <p>
                Create a folder to keep your notes organized.
              </p>
            </div>
          </div>

          <div className="create-folder-form">
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(event) =>
                setFolderName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCreateFolder();
                }
              }}
            />

            <button onClick={handleCreateFolder}>
              <Plus size={17} />
              Create Folder
            </button>
          </div>
        </section>

        <section className="organize-folders-section">
          <div className="organize-section-header">
            <div>
              <h2>Your Folders</h2>

              <p>
                {folders.length}{" "}
                {folders.length === 1 ? "folder" : "folders"}
              </p>
            </div>
          </div>

          {folders.length === 0 ? (
            <div className="organize-empty">
              <div className="organize-empty-icon">
                <Folder size={28} />
              </div>

              <h3>No folders yet</h3>

              <p>
                Create your first folder to organize your notes.
              </p>
            </div>
          ) : (
            <div className="organize-folder-grid">
              {folders.map((folder) => {
                const noteCount = getFolderNoteCount(
                  folder._id
                );

                const voiceCount = getFolderVoiceCount(
                  folder._id
                );

                const textCount = getFolderTextCount(
                  folder._id
                );

                return (
                  <article
                    className="organize-folder-card"
                    key={folder._id}
                  >
                    <div className="organize-folder-card-header">
                      <div
                        className="organize-folder-icon"
                        onClick={() =>
                          navigate(`/folders/${folder._id}`)
                        }
                      >
                        <Folder size={24} />
                      </div>

                      <div className="organize-folder-menu">
                        <button
                          className="organize-menu-btn"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === folder._id
                                ? null
                                : folder._id
                            )
                          }
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenuId === folder._id && (
                          <div className="organize-dropdown">
                            <button
                              onClick={() =>
                                handleStartRename(folder)
                              }
                            >
                              <Edit3 size={15} />
                              Rename
                            </button>

                            <button
                              className="delete-folder-option"
                              onClick={() =>
                                handleDeleteFolder(folder._id)
                              }
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {editingFolderId === folder._id ? (
                      <div className="organize-rename-box">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(event) =>
                            setEditingFolderName(
                              event.target.value
                            )
                          }
                          autoFocus
                        />

                        <div>
                          <button
                            onClick={() =>
                              handleSaveRename(folder._id)
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditingFolderId(null);
                              setEditingFolderName("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="organize-folder-content"
                        onClick={() =>
                          navigate(`/folders/${folder._id}`)
                        }
                      >
                        <h3>{folder.name}</h3>

                        <p>
                          {noteCount}{" "}
                          {noteCount === 1 ? "note" : "notes"}
                        </p>

                        <div className="organize-folder-stats">
                          <span>
                            <Mic size={14} />
                            {voiceCount}
                          </span>

                          <span>
                            <FileText size={14} />
                            {textCount}
                          </span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Organize;