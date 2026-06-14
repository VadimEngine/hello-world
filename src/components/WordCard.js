import React, { useState, useEffect } from "react";
import "./WordCard.css";

const WordCard = ({ wordData, handleNext, updateWordCounts, onSpeak }) => {
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

      <div className="word-title-row">
        <h2 className="word-title">{Word}</h2>
        <button
          className="speak-btn"
          onClick={() => onSpeak(Word)}
          aria-label="Read word aloud"
          title="Read aloud"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
      </div>

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
