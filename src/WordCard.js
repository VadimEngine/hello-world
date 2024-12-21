import React, { useState, useEffect } from "react";

const WordCard = ({ wordData, handleNext, updateWordCounts }) => {
  const { Word, Definition, Right, Wrong } = wordData;
  const [showDefinition, setShowDefinition] = useState(false);

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const handleKnow = () => {
    updateWordCounts(wordData, true); // Update for "Know"
    handleNext();
  };

  const handleDontKnow = () => {
    updateWordCounts(wordData, false); // Update for "Don't Know"
    handleNext();
  };

  // Reset showDefinition to false when wordData changes
  useEffect(() => {
    setShowDefinition(false);
  }, [wordData]);

  return (
    <div className="word-card">
      <div className="status">
        <span className="wrong" style={{ color: "red" }}>
          Wrong {Wrong}
        </span>
        <span className="right" style={{ color: "green" }}>
          Right {Right}
        </span>
      </div>
      <h2>{Word}</h2>
      {showDefinition && (
        <p
          className="definition"
          dangerouslySetInnerHTML={{
            __html: Definition.replace(/\\u00a0/g, "&nbsp;").replace(/\n/g, "<br />"),
          }}
        ></p>
      )}
      <a href="#" className="show-definition-link" onClick={toggleDefinition}>
        {showDefinition ? "Hide Definition" : "Show Definition"}
      </a>
      <div className="button-container">
        <button className="dont-know-button" onClick={handleDontKnow}>
          Don't Know
        </button>
        <button className="know-button" onClick={handleKnow}>
          Know
        </button>
      </div>
    </div>
  );
};

export default WordCard;
