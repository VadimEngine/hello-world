import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";

const FILTERS = ["All", "Known", "Unknown"];
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Sidebar = ({ wordData, onSelectWord, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState("words");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const sidebarRef = useRef(null);
  const wordListRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        window.innerWidth > 768 &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const filteredWords = wordData.filter((w) => {
    if (filter === "Known" && !(w.Right > w.Wrong)) return false;
    if (filter === "Unknown" && !(w.Right <= w.Wrong)) return false;
    if (search) return w.Word.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  // Group by first letter for alphabetical navigation
  const grouped = filteredWords.reduce((acc, word) => {
    const letter = word.Word[0]?.toUpperCase() || "#";
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(word);
    return acc;
  }, {});
  const availableLetters = new Set(Object.keys(grouped));

  const scrollToLetter = (letter) => {
    const el = sectionRefs.current[letter];
    const list = wordListRef.current;
    if (el && list) {
      // offsetTop is relative to the ul (position:relative), giving the natural
      // pre-sticky position — works correctly for both up and down jumps
      list.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  };

  // Stats calculations
  const total = wordData.length;
  const known = wordData.filter((w) => w.Right > w.Wrong).length;
  const unseen = wordData.filter((w) => w.Right === 0 && w.Wrong === 0).length;
  const struggling = total - known - unseen;
  const totalRight = wordData.reduce((sum, w) => sum + w.Right, 0);
  const totalWrong = wordData.reduce((sum, w) => sum + w.Wrong, 0);
  const totalAnswers = totalRight + totalWrong;
  const accuracy = totalAnswers > 0 ? Math.round((totalRight / totalAnswers) * 100) : null;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onToggle} />}

      <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? "‹" : "›"}
        </button>

        <div className="sidebar-content">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === "words" ? "active" : ""}`}
              onClick={() => setActiveTab("words")}
            >
              Words
            </button>
            <button
              className={`sidebar-tab ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
          </div>

          {activeTab === "words" && (
            <>
              <div className="search-wrap">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="sidebar-filters">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="word-list-wrap">
                <ul className="word-list" ref={wordListRef}>
                  {ALL_LETTERS.map((letter) => {
                    const words = grouped[letter];
                    if (!words) return null;
                    return (
                      <React.Fragment key={letter}>
                        {/* Non-sticky anchor — offsetTop is always the natural layout position */}
                        <li
                          className="section-anchor"
                          ref={(el) => { sectionRefs.current[letter] = el; }}
                          aria-hidden="true"
                        />
                        <li className="word-section-header">{letter}</li>
                        {words.map((wordItem, idx) => (
                          <li
                            key={`${letter}-${idx}`}
                            className="word-item"
                            onClick={() => onSelectWord(wordItem)}
                          >
                            <span className="word-name">{wordItem.Word}</span>
                            <span className="word-score">
                              <span className="score-right">{wordItem.Right}</span>
                              <span className="score-sep">/</span>
                              <span className="score-wrong">{wordItem.Wrong}</span>
                            </span>
                          </li>
                        ))}
                      </React.Fragment>
                    );
                  })}

                  {filteredWords.length === 0 && (
                    <li className="sidebar-empty-li">No words match</li>
                  )}
                </ul>

                {/* A–Z jump bar — hidden while search is active */}
                {!search && (
                  <div className="alpha-bar">
                    {ALL_LETTERS.map((letter) => (
                      <button
                        key={letter}
                        className={`alpha-btn ${availableLetters.has(letter) ? "available" : ""}`}
                        onClick={() => scrollToLetter(letter)}
                        disabled={!availableLetters.has(letter)}
                        aria-label={`Jump to ${letter}`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "stats" && (
            <div className="stats-panel">
              <div className="stat-row total">
                <span className="stat-label">Total</span>
                <span className="stat-value">{total}</span>
              </div>

              {total > 0 && (
                <div className="stats-bar">
                  {known > 0 && (
                    <div className="stats-bar-known" style={{ width: `${(known / total) * 100}%` }} />
                  )}
                  {struggling > 0 && (
                    <div className="stats-bar-struggling" style={{ width: `${(struggling / total) * 100}%` }} />
                  )}
                  {unseen > 0 && (
                    <div className="stats-bar-unseen" style={{ width: `${(unseen / total) * 100}%` }} />
                  )}
                </div>
              )}

              <div className="stat-row">
                <span className="stat-dot dot-known" />
                <span className="stat-label">Known</span>
                <span className="stat-count">{known}</span>
                <span className="stat-pct">{total > 0 ? Math.round((known / total) * 100) : 0}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-dot dot-struggling" />
                <span className="stat-label">Struggling</span>
                <span className="stat-count">{struggling}</span>
                <span className="stat-pct">{total > 0 ? Math.round((struggling / total) * 100) : 0}%</span>
              </div>
              <div className="stat-row">
                <span className="stat-dot dot-unseen" />
                <span className="stat-label">Unseen</span>
                <span className="stat-count">{unseen}</span>
                <span className="stat-pct">{total > 0 ? Math.round((unseen / total) * 100) : 0}%</span>
              </div>

              {accuracy !== null && (
                <>
                  <div className="stats-divider" />
                  <div className="stat-row">
                    <span className="stat-label">Accuracy</span>
                    <span className="stat-value accent">{accuracy}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Answers</span>
                    <span className="stat-value">{totalAnswers}</span>
                  </div>
                </>
              )}

              {accuracy === null && (
                <p className="sidebar-empty">No answers yet</p>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
