import React, { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const resetStats = () => {
    localStorage.clear();
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Vocabulary</h1>
      <button className="hamburger-button" onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li onClick={resetStats}>Reset Stats</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;