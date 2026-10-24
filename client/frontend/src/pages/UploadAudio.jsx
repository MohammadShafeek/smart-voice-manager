import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotes } from "../context/NotesContext";
import "./uploadaudio.css";

function UploadAudio() {
  const navigate = useNavigate();

  const { addNote } = useNotes();

  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // Validate the selected audio file and create a preview.
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file.");
      return;
    }

    setAudioFile(file);

    const previewUrl = URL.createObjectURL(file);
    setAudioUrl(previewUrl);
  };

  // Upload the audio file and create a voice note.
  const handleSaveAudio = async () => {
    if (!title.trim()) {
      alert("Please enter a note title.");
      return;
    }

    if (!audioFile) {
      alert("Please select an audio file.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("audio", audioFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/audio/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Audio upload failed."
        );
      }

      const audioNote = {
        title: title.trim(),
        type: "upload",
        audioUrl: `http://localhost:5000/uploads/${data.file.filename}`,
        transcript: "",
        duration: 0,
        createdAt: Date.now(),
      };

      await addNote(audioNote);

      navigate("/notes");
    } catch (error) {
      console.error("Audio upload error:", error);
      alert("Unable to upload audio.");
    }
  };

  return (
    <main className="upload-audio-page">
      <div className="upload-audio-container">
        <div className="upload-audio-header">
          <h1>Upload Audio</h1>

          <p>
            Upload an existing audio file and save it as a voice note.
          </p>
        </div>

        <section className="upload-audio-card">
          {/* Note title */}
          <div className="upload-field">
            <label>Note Title</label>

            <input
              type="text"
              placeholder="Enter audio note title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />
          </div>

          {/* Audio file */}
          <div className="upload-field">
            <label>Select Audio File</label>

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Selected file */}
          {audioFile && (
            <div className="selected-audio">
              <p>
                Selected file:{" "}
                <strong>{audioFile.name}</strong>
              </p>
            </div>
          )}

          {/* Audio preview */}
          {audioUrl && (
            <div className="upload-audio-preview">
              <h3>Audio Preview</h3>

              <audio controls src={audioUrl} />
            </div>
          )}

          {/* Action buttons */}
          <div className="upload-audio-actions">
            <button
              className="cancel-upload-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              className="save-upload-btn"
              onClick={handleSaveAudio}
            >
              Save Audio Note
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UploadAudio;