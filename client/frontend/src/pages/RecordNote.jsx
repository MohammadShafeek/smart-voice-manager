import React, { useEffect, useRef, useState } from "react";
import "./recordnote.css";
import NoteCard from "../components/NoteCard";
import { useNotes } from "../context/NotesContext";

function RecordNote() {
  const {
    notes: savedNotes,
    addNote,
    deleteNote,
    updateNote,
  } = useNotes();

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [seconds, setSeconds] = useState(0);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [transcript, setTranscript] = useState("");
  const [pendingVoiceNote, setPendingVoiceNote] = useState(null);

  // Stores recording and microphone objects.
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const [autoSave] = useState(() => {
    const savedSettings = localStorage.getItem("settings");

    if (!savedSettings) {
      return true;
    }

    const parsedSettings = JSON.parse(savedSettings);

    return parsedSettings.autoSave ?? true;
  });

  // Start recording audio and speech recognition.
  const startRecording = async () => {
    if (!title.trim()) {
      alert("Please enter a title for voice note.");
      return;
    }

    try {
      setSeconds(0);
      setTranscript("");
      setAudioUrl(null);

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      // Store recorded audio chunks.
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start speech-to-text if the browser supports it.
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
          let text = "";

          for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
          ) {
            text += event.results[i][0].transcript;
          }

          if (text) {
            setTranscript(text);
          }
        };

        recognition.onerror = (event) => {
          console.error(
            "Speech Recognition error:",
            event.error
          );
        };

        recognition.onend = () => {
          console.log("Speech recognition stopped.");
        };

        recognition.start();

        recognitionRef.current = recognition;
      } else {
        console.log(
          "Speech Recognition is not supported in this browser."
        );
      }

      recorder.start();
      setIsRecording(true);

      console.log("Recording started...");
    } catch (error) {
      console.error("Recording error:", error);

      alert(
        "Microphone access is required to record. Please check browser permission."
      );
    }
  };

  // Update the recording timer while recording.
  useEffect(() => {
    let timer;

    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRecording]);

  // Stop recording and upload the audio file.
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    recorder.onstop = async () => {
      try {
        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const formData = new FormData();

        formData.append(
          "audio",
          audioBlob,
          `${title.trim()}-${Date.now()}.webm`
        );

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

        console.log("Recording uploaded:", data);

        const uploadedAudioUrl =
          `http://localhost:5000/uploads/${data.file.filename}`;

        setAudioUrl(uploadedAudioUrl);

        const voiceNote = {
          title: title.trim(),
          type: "voice",
          audioUrl: uploadedAudioUrl,
          transcript,
          duration: seconds,
        };

        // Save automatically or wait for manual save.
        if (autoSave) {
          await addNote(voiceNote);
          console.log("Voice note saved automatically.");
        } else {
          setPendingVoiceNote(voiceNote);
          console.log(
            "Voice note is ready to save manually."
          );
        }
      } catch (error) {
        console.error("Voice note save error:", error);

        alert(
          "Unable to save voice note. Please try again."
        );
      }
    };

    // Stop speech recognition.
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Recognition already stopped.");
      }

      recognitionRef.current = null;
    }

    recorder.stop();

    // Release microphone access.
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setIsRecording(false);

    console.log("Recording stopped.");
  };

  // Save the voice note manually when auto-save is OFF.
  const savePendingVoiceNote = async () => {
    if (!pendingVoiceNote) {
      return;
    }

    try {
      await addNote(pendingVoiceNote);

      setPendingVoiceNote(null);

      console.log("Voice note saved manually.");
    } catch (error) {
      console.error(
        "Manual voice note save error:",
        error
      );
    }
  };

  // Open edit mode for the selected note.
  const startEditing = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);

    setEditContent(
      note.type === "text"
        ? note.content || ""
        : ""
    );
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
      console.error(
        "Error saving edited note:",
        error
      );
    }
  };

  return (
    <main className="record-page">
      <section className="record-card">
        <h1>Record Note</h1>

        <p>Record your thoughts and ideas</p>

        <div className="input-group">
          <label>Note Title</label>

          <input
            type="text"
            placeholder="Enter voice note title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div
          className={`mic-circle ${
            isRecording ? "recording" : ""
          }`}
        >
          🎙️
        </div>

        <div className="timer">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}
          :
          {String(seconds % 60).padStart(2, "0")}
        </div>

        <div
          className={`waveform ${
            isRecording ? "active" : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <button
          className="start-btn"
          onClick={
            isRecording
              ? stopRecording
              : startRecording
          }
        >
          {isRecording
            ? "Stop Recording"
            : "Start Recording"}
        </button>

        {audioUrl && (
          <div className="audio-preview">
            <audio controls src={audioUrl}></audio>
          </div>
        )}

        {pendingVoiceNote && (
          <button
            className="save-note-btn"
            onClick={savePendingVoiceNote}
          >
            Save Note
          </button>
        )}
      </section>

      {savedNotes.length > 0 && (
        <section className="saved-notes">
          <h2>Saved Voice Notes</h2>

          {savedNotes.map((note) => (
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
        </section>
      )}
    </main>
  );
}

export default RecordNote;