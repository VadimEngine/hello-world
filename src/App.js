import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import WordCard from "./components/WordCard";
import "./App.css";

const LS_VOICE_ON = "vocab_voice_on";
const LS_VOICE_URI = "vocab_voice_uri";
const getPool = (data, activeListId, wordLists) => {
  if (activeListId === null) return data;
  const list = wordLists.find((l) => l.id === activeListId);
  if (!list) return data;
  return list.indices.map((i) => data[i]).filter(Boolean);
};

// Picks the next word: avoids repeating current, biases 70% toward unseen words.
const pickNext = (pool, current) => {
  const candidates = current ? pool.filter((w) => w.Word !== current.Word) : pool;
  if (candidates.length === 0) return current ?? pool[0] ?? null;
  const unknown = candidates.filter((w) => (w.Right === 0 && w.Wrong === 0) || w.Wrong > w.Right);
  if (unknown.length > 0 && Math.random() < 0.7) {
    return unknown[Math.floor(Math.random() * unknown.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
};

function App() {
  const [wordData, setWordData] = useState([]);
  const [wordLists, setWordLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [currentWord, setCurrentWord] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);

  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem(LS_VOICE_ON);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(
    () => localStorage.getItem(LS_VOICE_URI) || ""
  );

  useEffect(() => {
    Promise.all([
      fetch(process.env.PUBLIC_URL + "/Dictionary.json").then((r) => r.json()),
      fetch(process.env.PUBLIC_URL + "/WordLists.json").then((r) => r.json()),
    ])
      .then(([dictData, listsData]) => {
        const loaded = dictData.map((word) => ({
          ...word,
          Right: Number(localStorage.getItem(`${word.Word}-Right`) || 0),
          Wrong: Number(localStorage.getItem(`${word.Word}-Wrong`) || 0),
        }));
        setWordData(loaded);
        setWordLists(listsData);
        if (loaded.length > 0) {
          setCurrentWord(loaded[Math.floor(Math.random() * loaded.length)]);
        }
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (!v.length) return;
      setVoices(v);
      setSelectedVoiceURI((uri) => {
        if (uri && v.some((vv) => vv.voiceURI === uri)) return uri;
        const def = v.find((vv) => vv.default) || v[0];
        return def?.voiceURI ?? "";
      });
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_VOICE_ON, JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    if (selectedVoiceURI) localStorage.setItem(LS_VOICE_URI, selectedVoiceURI);
  }, [selectedVoiceURI]);

  const speakWord = useCallback(
    (text) => {
      if (!voiceEnabled || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = voices.find((vv) => vv.voiceURI === selectedVoiceURI);
      if (v) { u.voice = v; u.lang = v.lang; }
      window.speechSynthesis.speak(u);
    },
    [voiceEnabled, voices, selectedVoiceURI]
  );

  const testVoice = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Hello! This is a test of the selected voice.");
    const v = voices.find((vv) => vv.voiceURI === selectedVoiceURI);
    if (v) { u.voice = v; u.lang = v.lang; }
    window.speechSynthesis.speak(u);
  }, [voices, selectedVoiceURI]);

  const handleNext = () => {
    setWordData((prev) => {
      const pool = getPool(prev, activeListId, wordLists);
      setCurrentWord((cur) => pickNext(pool, cur));
      return prev;
    });
  };

  const handleSelectWord = (word) => {
    setCurrentWord(word);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleSelectList = (id) => {
    setActiveListId(id);
    const pool = getPool(wordData, id, wordLists);
    setCurrentWord((cur) => pickNext(pool, cur));
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
        wordLists={wordLists}
        activeListId={activeListId}
        onSelectList={handleSelectList}
      />
      <div className="main">
        <Navbar
          onResetStats={resetStats}
          onToggleSidebar={toggleSidebar}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled((v) => !v)}
          voices={voices}
          selectedVoiceURI={selectedVoiceURI}
          onSelectVoice={setSelectedVoiceURI}
          onTestVoice={testVoice}
        />
        <div className="content">
          {currentWord ? (
            <WordCard
              wordData={currentWord}
              handleNext={handleNext}
              updateWordCounts={updateWordCounts}
              onSpeak={speakWord}
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
