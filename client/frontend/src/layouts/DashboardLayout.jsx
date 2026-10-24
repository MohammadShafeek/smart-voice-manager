import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Open the sidebar when the mobile menu button is clicked.
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Close the sidebar from the close button, overlay, or menu item.
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Navbar onMenuClick={openMobileMenu} />

      <div className="app-layout">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;