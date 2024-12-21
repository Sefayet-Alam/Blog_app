import { FaBlog, FaBars } from "react-icons/fa"; // Import icons
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false); // State to toggle drawer

  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaBlog size={24} color="#ff7f50" />
        <Link to="/">Sefayet's Blogs</Link>
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="mobile-menu-icon" onClick={toggleDrawer}>
        <FaBars size={24} />
      </div>

      {/* Desktop Menu Links */}
      <ul className={`navbar-links ${drawerOpen ? "active" : ""}`}>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/teams">Team</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button
                className="logout-button"
                onClick={(e) => {
                  e.preventDefault(); // Prevent page reload
                  handleLogout();
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="mobile-drawer">
          <ul>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" onClick={toggleDrawer}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={toggleDrawer}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" onClick={toggleDrawer}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="logout-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                      toggleDrawer();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
