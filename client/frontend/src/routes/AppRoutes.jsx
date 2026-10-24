import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RecordNote from "../pages/RecordNote";
import MyNotes from "../pages/MyNotes";
import NoteDetails from "../pages/NoteDetails";
import CreateTextNote from "../pages/CreateTextNote";
import UploadAudio from "../pages/UploadAudio";
import Folders from "../pages/Folders";
import FolderDetails from "../pages/FolderDetails";
import Tags from "../pages/Tags";
import Organize from "../pages/Organize";
import Settings from "../pages/Settings";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function Home() {
  return (
    <main className="home-page">
      <div className="home-content">
        <h1>Welcome to Smart Voice Manager</h1>

        <p>Manage your voice and text notes easily.</p>

        <div className="home-buttons">
          <Link to="/login" className="home-login-btn">
            Login
          </Link>

          <Link to="/signup" className="home-signup-btn">
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/record" element={<RecordNote />} />

          <Route path="/notes" element={<MyNotes />} />

          <Route path="/note/:id" element={<NoteDetails />} />

          <Route path="/create-note" element={<CreateTextNote />} />

          <Route path="/upload-audio" element={<UploadAudio />} />

          <Route path="/folders" element={<Folders />} />

          <Route path="/folders/:id" element={<FolderDetails />} />

          <Route path="/tags" element={<Tags />} />

          <Route path="/organize" element={<Organize />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
