import React, { useState, useEffect, useRef } from "react";

const Sidebar = ({ wordData, onSelectWord }) => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle the sidebar
  const sidebarRef = useRef(null); // Ref to detect clicks outside the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleWordClick = (word) => {
    onSelectWord(word); // Pass the selected word to the parent component
    setIsOpen(false); // Close sidebar if click is outside
  };

  // Close sidebar when clicking outside of it (for mobile devices)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close sidebar if click is outside
      }
    };

    // Add the event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${isOpen ? "open" : "closed"}`}
    >
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "Hide" : "Show"}
      </button>
      {isOpen && (
        <div>
          {/* Header for the sidebar */}
          <h3 className="sidebar-header">Words</h3>
          <ul className="menu">
            {wordData.map((wordItem, index) => (
              <li key={index} onClick={() => handleWordClick(wordItem)}>
                {`${index}) ${wordItem.Word}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
