import React, { useEffect, useState } from "react";
import { User, Bell, Save, Database, Info, Trash2 } from "lucide-react";

import { updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./settings.css";

function Settings() {
  const { user, login } = useAuth();

  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem("settings");

    if (storedSettings) {
      return JSON.parse(storedSettings);
    }

    return {
      displayName: user?.name || "",
      email: user?.email || "",
      notifications: true,
      autoSave: true,
      defaultNoteType: "voice",
    };
  });

  // Save settings locally whenever they change.
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Update one setting without changing the other values.
  const updateSetting = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Save profile changes to the backend.
  const handleSaveProfile = async () => {
    try {
      const updatedData = await updateProfile({
        name: settings.displayName,
        email: settings.email,
      });

      login(updatedData.user);

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  // Remove locally stored note and folder data.
  const handleClearData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all local notes and folders?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("voiceNotes");
    localStorage.removeItem("folders");

    alert("Local notes and folders cleared.");
  };

  return (
    <main className="settings-page">
      <div className="settings-container">
        <section className="settings-header">
          <div>
            <h1>Settings</h1>

            <p>
              Manage your account, preferences and application data.
            </p>
          </div>
        </section>

        {/* Profile */}

        <section className="settings-section">
          <div className="settings-section-title">
            <User size={20} />

            <div>
              <h2>Profile</h2>

              <p>
                Manage your basic profile information.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label>Display Name</label>

              <input
                type="text"
                value={settings.displayName}
                onChange={(event) =>
                  updateSetting(
                    "displayName",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="settings-field">
              <label>Email</label>

              <input
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateSetting(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <button
            className="settings-save-btn"
            onClick={handleSaveProfile}
          >
            <Save size={16} />
            Save Profile
          </button>
        </section>

        {/* Preferences */}

        <section className="settings-section">
          <div className="settings-section-title">
            <Bell size={20} />

            <div>
              <h2>Preferences</h2>

              <p>
                Control how Smart Voice Manager behaves.
              </p>
            </div>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <strong>Notifications</strong>

                <span>
                  Receive application notifications.
                </span>
              </div>

              <button
                className={`settings-toggle ${
                  settings.notifications ? "active" : ""
                }`}
                onClick={() =>
                  updateSetting(
                    "notifications",
                    !settings.notifications
                  )
                }
              >
                <span></span>
              </button>
            </div>

            <div className="settings-option">
              <div>
                <strong>Auto Save</strong>

                <span>
                  Automatically save note changes.
                </span>
              </div>

              <button
                className={`settings-toggle ${
                  settings.autoSave ? "active" : ""
                }`}
                onClick={() =>
                  updateSetting(
                    "autoSave",
                    !settings.autoSave
                  )
                }
              >
                <span></span>
              </button>
            </div>

            <div className="settings-option">
              <div>
                <strong>Default Note Type</strong>

                <span>
                  Choose the default type for new notes.
                </span>
              </div>

              <select
                value={settings.defaultNoteType}
                onChange={(event) =>
                  updateSetting(
                    "defaultNoteType",
                    event.target.value
                  )
                }
              >
                <option value="voice">Voice Note</option>
                <option value="text">Text Note</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data Management */}

        <section className="settings-section">
          <div className="settings-section-title">
            <Database size={20} />

            <div>
              <h2>Data Management</h2>

              <p>
                Manage locally stored application data.
              </p>
            </div>
          </div>

          <div className="settings-danger-box">
            <div>
              <strong>Clear Local Data</strong>

              <span>
                Remove locally stored notes and folders from this browser.
              </span>
            </div>

            <button
              onClick={handleClearData}
              className="settings-danger-btn"
            >
              <Trash2 size={16} />
              Clear Data
            </button>
          </div>
        </section>

        {/* About */}

        <section className="settings-section">
          <div className="settings-section-title">
            <Info size={20} />

            <div>
              <h2>About</h2>

              <p>
                Information about Smart Voice Manager.
              </p>
            </div>
          </div>

          <div className="settings-about">
            <div>
              <span>Application</span>
              <strong>Smart Voice Manager</strong>
            </div>

            <div>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;