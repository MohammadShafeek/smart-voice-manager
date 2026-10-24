const API_URL = "http://localhost:5000/api";

// Add the token to requests that require login.
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ==================== NOTES ====================

// Create a new note.
export const createNote = async (noteData) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create note"
    );
  }

  return data;
};

// Get all notes of the logged-in user.
export const getNotes = async () => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch notes"
    );
  }

  return data;
};

// Update an existing note.
export const updateNote = async (noteId, noteData) => {
  const response = await fetch(
    `${API_URL}/notes/${noteId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update note"
    );
  }

  return data;
};

// Delete a note.
export const deleteNote = async (noteId) => {
  const response = await fetch(
    `${API_URL}/notes/${noteId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete note"
    );
  }

  return data;
};

// ==================== AUTH ====================

// Register a new user.
export const signupUser = async (signupData) => {
  const response = await fetch(
    `${API_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Signup failed"
    );
  }

  return data;
};

// Login user.
export const loginUser = async (loginData) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
};

// Reset password using the reset token.
export const resetPassword = async (
  token,
  newPassword
) => {
  const response = await fetch(
    `${API_URL}/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to reset password"
    );
  }

  return data;
};

// Send a forgot-password request.
export const forgotPassword = async (email) => {
  const response = await fetch(
    `${API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to process password reset"
    );
  }

  return data;
};

// Update the logged-in user's profile.
export const updateProfile = async (profileData) => {
  const response = await fetch(
    `${API_URL}/auth/profile`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update profile"
    );
  }

  return data;
};

// ==================== FOLDERS ====================

// Create a new folder.
export const createFolder = async (folderData) => {
  const response = await fetch(
    `${API_URL}/folders`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(folderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create folder"
    );
  }

  return data;
};

// Get all folders of the logged-in user.
export const getFolders = async () => {
  const response = await fetch(
    `${API_URL}/folders`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch folders"
    );
  }

  return data;
};

// Update an existing folder.
export const updateFolder = async (
  folderId,
  folderData
) => {
  const response = await fetch(
    `${API_URL}/folders/${folderId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(folderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update folder"
    );
  }

  return data;
};

// Delete a folder.
export const deleteFolder = async (folderId) => {
  const response = await fetch(
    `${API_URL}/folders/${folderId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete folder"
    );
  }

  return data;
};