import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import WordCard from "./components/WordCard";
import "./App.css";

function App() {
  const [wordData, setWordData] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Dictionary.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const loaded = data.map((word) => ({
          ...word,
          Right: Number(localStorage.getItem(`${word.Word}-Right`) || 0),
          Wrong: Number(localStorage.getItem(`${word.Word}-Wrong`) || 0),
        }));
        setWordData(loaded);
        pickRandom(loaded);
      })
      .catch((err) => console.error("Error loading Dictionary:", err));
  }, []);

  const pickRandom = (data) => {
    if (data.length > 0) {
      setCurrentWord(data[Math.floor(Math.random() * data.length)]);
    }
  };

  const handleNext = () => {
    setWordData((prev) => {
      pickRandom(prev);
      return prev;
    });
  };

  const handleSelectWord = (word) => {
    setCurrentWord(word);
    // Close sidebar on mobile after selecting a word
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const updateWordCounts = (word, isCorrect) => {
    const newRight = isCorrect ? word.Right + 1 : word.Right;
    const newWrong = isCorrect ? word.Wrong : word.Wrong + 1;
    localStorage.setItem(`${word.Word}-Right`, newRight);
    localStorage.setItem(`${word.Word}-Wrong`, newWrong);
    setWordData((prev) =>
      prev.map((item) =>
        item.Word === word.Word ? { ...item, Right: newRight, Wrong: newWrong } : item
      )
    );
  };

  const resetStats = () => {
    localStorage.clear();
    setWordData((prev) => prev.map((w) => ({ ...w, Right: 0, Wrong: 0 })));
    setCurrentWord((prev) => (prev ? { ...prev, Right: 0, Wrong: 0 } : prev));
  };

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <div className="app">
      <Sidebar
        wordData={wordData}
        onSelectWord={handleSelectWord}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className="main">
        <Navbar onResetStats={resetStats} onToggleSidebar={toggleSidebar} />
        <div className="content">
          {currentWord ? (
            <WordCard
              wordData={currentWord}
              handleNext={handleNext}
              updateWordCounts={updateWordCounts}
            />
          ) : (
            <p className="loading">Loading words…</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
