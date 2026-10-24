import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getNotes,
  getFolders,
  createNote,
  deleteNote as deleteNoteApi,
  updateNote as updateNoteApi,
} from "../services/api";
import { useAuth } from "./AuthContext";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { user } = useAuth();

  // Keep notifications separate for each logged-in user.
  const notificationStorageKey = user?.id
    ? `notifications_${user.id}`
    : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);

  // Load saved notifications when the logged-in user changes.
  useEffect(() => {
    if (!notificationStorageKey) {
      setNotifications([]);
      return;
    }

    const storedNotifications =
      localStorage.getItem(notificationStorageKey);

    setNotifications(
      storedNotifications ? JSON.parse(storedNotifications) : []
    );
  }, [notificationStorageKey]);

  // Save notifications whenever they change.
  useEffect(() => {
    if (!notificationStorageKey) {
      return;
    }

    localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(notifications)
    );
  }, [notifications, notificationStorageKey]);

  // Add a new notification and keep only the latest 5.
  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      createdAt: Date.now(),
      read: false,
    };

    setNotifications((prevNotifications) =>
      [newNotification, ...prevNotifications].slice(0, 5)
    );
  };

  // Mark one notification as read.
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read.
  const markAllNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Remove all notifications.
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Load notes from MongoDB.
  const loadNotes = async () => {
    try {
      const backendNotes = await getNotes();

      console.log("Notes received from backend:", backendNotes);

      setNotes(backendNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  // Reload notes whenever the logged-in user changes.
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    setNotes([]);
    loadNotes();
  }, [user]);

  // Load folders from MongoDB.
  const loadFolders = async () => {
    try {
      const backendFolders = await getFolders();

      console.log("Folders received from backend:", backendFolders);

      setFolders(backendFolders);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  // Reload folders whenever the logged-in user changes.
  useEffect(() => {
    if (!user) {
      setFolders([]);
      return;
    }

    setFolders([]);
    loadFolders();
  }, [user]);

  // Create a note in the backend and update the UI.
  const addNote = async (newNote) => {
    try {
      const savedNote = await createNote(newNote);

      setNotes((prevNotes) => [...prevNotes, savedNote]);

      if (savedNote.type === "text") {
        addNotification("New text note created", "text");
      } else if (savedNote.type === "upload") {
        addNotification("New audio note uploaded", "audio");
      } else {
        addNotification("New voice note created", "voice");
      }

      return savedNote;
    } catch (error) {
      console.error("Error creating note:", error);

      alert("Unable to save note. Please try again.");

      throw error;
    }
  };

  // Delete the note from MongoDB and remove it from the UI.
  const deleteNote = async (noteId) => {
    try {
      await deleteNoteApi(noteId);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      );
    } catch (error) {
      console.error("Error deleting note:", error);

      alert("Unable to delete note. Please try again.");
    }
  };

  // Update note data in MongoDB and update the local state.
  const updateNote = async (noteId, noteData) => {
    try {
      const updatedNote = await updateNoteApi(noteId, noteData);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? updatedNote : note
        )
      );

      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);

      alert("Unable to update note. Please try again.");

      throw error;
    }
  };

  // Update the folder assigned to a note.
  const updateNoteFolder = async (noteId, folderId) => {
    try {
      const updatedNote = await updateNoteApi(noteId, {
        folderId,
      });

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? updatedNote : note
        )
      );

      return updatedNote;
    } catch (error) {
      console.error("Error updating note folder:", error);

      alert("Unable to move note to folder. Please try again.");

      throw error;
    }
  };

  // Update the tags assigned to a note.
  const updateNoteTags = async (noteId, tagIds) => {
    console.log("TAG CLICKED:", noteId, tagIds);

    try {
      const updatedNote = await updateNoteApi(noteId, {
        tagIds,
      });

      console.log("UPDATED NOTE:", updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? updatedNote : note
        )
      );

      return updatedNote;
    } catch (error) {
      console.error("TAG UPDATE ERROR:", error);

      alert("Unable to update note tags. Please try again.");

      throw error;
    }
  };

  // Remove a deleted folder from all notes that used it.
  const removeFolderFromNotes = async (folderId) => {
    try {
      const notesToUpdate = notes.filter(
        (note) => note.folderId === folderId
      );

      await Promise.all(
        notesToUpdate.map((note) =>
          updateNoteApi(note._id, {
            folderId: null,
          })
        )
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.folderId === folderId
            ? { ...note, folderId: null }
            : note
        )
      );
    } catch (error) {
      console.error("Error removing folder from notes:", error);

      alert(
        "Unable to remove folder from notes. Please try again."
      );

      throw error;
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loadNotes,
        folders,
        loadFolders,
        addNote,
        deleteNote,
        updateNote,
        updateNoteFolder,
        updateNoteTags,
        removeFolderFromNotes,

        searchQuery,
        setSearchQuery,

        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}