import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({
  onResetStats,
  onToggleSidebar,
  voiceEnabled,
  onToggleVoice,
  voices,
  selectedVoiceURI,
  onSelectVoice,
  onTestVoice,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voiceDropOpen, setVoiceDropOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setVoiceDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    onResetStats();
    setMenuOpen(false);
  };

  const selectedVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);

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
            <div className="nav-dropdown-section">
              <div className="nav-voice-row">
                <span className="nav-voice-label">Read aloud</span>
                <div
                  className={`nav-toggle ${voiceEnabled ? "on" : ""}`}
                  onClick={onToggleVoice}
                  role="switch"
                  aria-checked={voiceEnabled}
                />
              </div>

              {voiceEnabled && (
                <>
                  <div className="nav-voice-test-row">
                    <span className="nav-voice-sublabel">Voice</span>
                    <button className="nav-voice-test-btn" onClick={onTestVoice}>
                      &#9654; Test
                    </button>
                  </div>

                  <div className="nav-voice-picker">
                    <button
                      className={`nav-voice-picker-btn ${voiceDropOpen ? "open" : ""}`}
                      onClick={() => setVoiceDropOpen((v) => !v)}
                    >
                      <span className="nav-voice-picker-label">
                        {selectedVoice ? selectedVoice.name : "Select voice…"}
                      </span>
                      <svg className="nav-voice-picker-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {voiceDropOpen && (
                      <div className="nav-voice-picker-list">
                        {voices.map((v) => (
                          <button
                            key={v.voiceURI}
                            className={`nav-voice-picker-item ${v.voiceURI === selectedVoiceURI ? "selected" : ""}`}
                            onClick={() => {
                              onSelectVoice(v.voiceURI);
                              setVoiceDropOpen(false);
                            }}
                          >
                            <span className="nav-voice-picker-name">{v.name}</span>
                            <span className="nav-voice-picker-lang">{v.lang}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="nav-dropdown-divider" />

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
