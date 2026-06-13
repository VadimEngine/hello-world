import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({ onResetStats, onToggleSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    onResetStats();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        className="navbar-sidebar-btn"
        onClick={onToggleSidebar}
        aria-label="Toggle word list"
      >
        <span className="panel-icon">
          <span className="panel-left" />
          <span className="panel-right" />
        </span>
      </button>

      <h1 className="navbar-title">Vocabulary</h1>

      <div className="navbar-menu-wrap" ref={menuRef}>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
        {menuOpen && (
          <div className="nav-dropdown">
            <button className="nav-dropdown-item danger" onClick={handleReset}>
              Reset Stats
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
