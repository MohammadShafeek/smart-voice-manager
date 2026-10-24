import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  FileText,
  Folder,
  Tags,
  Settings,
  X,
} from "lucide-react";
import "./sidebar.css";

function Sidebar({ isMobileMenuOpen, onClose }) {
  // Close the mobile sidebar after selecting a menu item.
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Close the sidebar when the user clicks outside it. */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`sidebar ${
          isMobileMenuOpen ? "mobile-sidebar-open" : ""
        }`}
      >
        {/* Close button is mainly used on mobile screens. */}
        <button
          className="mobile-close-button"
          onClick={onClose}
          aria-label="Close menu"
          type="button"
        >
          <X size={22} />
        </button>

        <div className="sidebar-menu">
          <NavLink
            to="/dashboard"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/record"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <Mic size={20} />
            <span>Record</span>
          </NavLink>

          <NavLink
            to="/notes"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <FileText size={20} />
            <span>My Notes</span>
          </NavLink>

          <NavLink
            to="/folders"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <Folder size={20} />
            <span>Folders</span>
          </NavLink>

          <NavLink
            to="/tags"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <Tags size={20} />
            <span>Tags</span>
          </NavLink>

          <NavLink
            to="/settings"
            className="sidebar-item"
            onClick={handleLinkClick}
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <p>Smart Voice Manager</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
