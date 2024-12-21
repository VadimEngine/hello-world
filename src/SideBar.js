import React, { useState } from "react";

const Sidebar = ({ wordData, onSelectWord }) => {
  const [isOpen, setIsOpen] = useState(true); // State to toggle the sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle selecting a word from the sidebar
  const handleWordClick = (word) => {
    onSelectWord(word); // Pass the selected word to the parent component
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
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
