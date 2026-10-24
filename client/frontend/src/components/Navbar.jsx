import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/logo.png";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";

import {
  Bell,
  Mic,
  FileText,
  Folder,
  Settings,
  CheckCheck,
  Trash2,
  Menu,
} from "lucide-react";

const navItems = [
  {
    name: "Record",
    path: "/record",
    icon: <Mic size={20} />,
  },
  {
    name: "Organize",
    path: "/organize",
    icon: <Folder size={20} />,
  },
  {
    name: "My Notes",
    path: "/notes",
    icon: <FileText size={20} />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
];

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useNotes();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const { user, logout } = useAuth();

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "";

  return (
    <nav className="navbar">
      {/* Mobile menu */}
      <button
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
        type="button"
      >
        <Menu size={22} />
        <span>Menu</span>
      </button>

      {/* Logo and brand name */}
      <div className="navbar-brand">
        <img
          src={logo}
          alt="Smart Voice Manager"
          className="logo"
        />

        <div className="brand-title">
          <h1>
            Smart <span className="brand-highlight">Voice</span> Manager
          </h1>
        </div>
      </div>

      {/* Navigation links */}
      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="notification-wrapper">
          <button
            className="icon-button"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>

                {notifications.length > 0 && (
                  <button
                    className="clear-notifications-btn"
                    onClick={clearNotifications}
                    title="Clear all notifications"
                    type="button"
                  >
                    <Trash2 size={15} />
                    Clear all
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="no-notifications">
                  No notifications yet.
                </p>
              ) : (
                <>
                  {unreadCount > 0 && (
                    <div className="notification-actions">
                      <button
                        onClick={markAllNotificationsAsRead}
                        type="button"
                      >
                        <CheckCheck size={15} />
                        Mark all as read
                      </button>
                    </div>
                  )}

                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          notification.read ? "read" : "unread"
                        }`}
                        onClick={() =>
                          markNotificationAsRead(notification.id)
                        }
                      >
                        <div className="notification-content">
                          <span
                            className={`notification-type-dot ${notification.type}`}
                          ></span>

                          <div>
                            <p>{notification.message}</p>

                            <span>
                              {new Date(
                                notification.createdAt
                              ).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        {!notification.read && (
                          <span className="unread-indicator">●</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sign up */}
        {!user && (
          <NavLink to="/signup" className="signup-button">
            Sign up
          </NavLink>
        )}

        {/* User profile */}
        {user && (
          <div className="profile-wrapper">
            <div
              className="profile-avatar"
              title={user.name}
              onClick={() => setShowProfile(!showProfile)}
            >
              {userInitial}
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-dropdown-avatar">
                    {userInitial}
                  </div>

                  <div>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="profile-divider"></div>

                <NavLink
                  to="/settings"
                  className="profile-menu-item"
                  onClick={() => setShowProfile(false)}
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </NavLink>

                <button
                  className="profile-menu-item logout-item"
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                    navigate("/login");
                  }}
                  type="button"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
