import React, { useState, useEffect } from "react";
import "./WordCard.css";

const WordCard = ({ wordData, handleNext, updateWordCounts }) => {
  const { Word, Definition, Right, Wrong } = wordData;
  const [showDefinition, setShowDefinition] = useState(false);

  useEffect(() => {
    setShowDefinition(false);
  }, [wordData]);

  const handleKnow = () => {
    updateWordCounts(wordData, true);
    handleNext();
  };

  const handleDontKnow = () => {
    updateWordCounts(wordData, false);
    handleNext();
  };

  const total = Right + Wrong;
  const accuracy = total > 0 ? Math.round((Right / total) * 100) : null;

  return (
    <div className="word-card">
      <div className="word-card-stats">
        <span className="stat-wrong">{Wrong} ✗</span>
        <span className="stat-right">{Right} ✓</span>
      </div>

      {total > 0 && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(Right / total) * 100}%` }}
          />
        </div>
      )}

      {accuracy !== null && (
        <p className="accuracy">{accuracy}% accuracy</p>
      )}

      <h2 className="word-title">{Word}</h2>

      <button
        className="reveal-btn"
        onClick={() => setShowDefinition((v) => !v)}
      >
        {showDefinition ? "Hide Definition" : "Show Definition"}
      </button>

      {showDefinition && (
        <p
          className="definition"
          dangerouslySetInnerHTML={{
            __html: Definition.replace(/\r\n/g, "\n").replace(/\\u00a0/g, "&nbsp;").replace(/\n/g, "<br />"),
          }}
        />
      )}

      <div className="card-actions">
        <button className="btn-dont-know" onClick={handleDontKnow}>
          Don't Know
        </button>
        <button className="btn-know" onClick={handleKnow}>
          Know
        </button>
      </div>

      <button className="btn-next" onClick={handleNext}>
        Next →
      </button>
    </div>
  );
};

export default WordCard;
