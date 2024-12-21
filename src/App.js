import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import Sidebar from "./SideBar";
import WordCard from "./WordCard";

function App() {
  const [wordData, setWordData] = useState([]); // Store the array of words
  const [currentWord, setCurrentWord] = useState(null); // Store the currently displayed word

  // Fetch data from Dictionary.json
  useEffect(() => {
    fetch("/Dictionary.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setWordData(data);
        setRandomWord(data); // Set the first random word
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  // Function to set a random word
  const setRandomWord = (data) => {
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentWord(data[randomIndex]);
    }
  };

  // Function to handle the "Next" button click
  const handleNext = () => {
    setRandomWord(wordData);
  };

  // Function to set the selected word from the Sidebar
  const handleSelectWord = (word) => {
    setCurrentWord(word); // Update current word to the selected one
  };

  return (
    <div className="App">
      <Sidebar wordData={wordData} onSelectWord={handleSelectWord} />
      <div className="word-card-container">
        <NavBar />
        {/* Render the current word if loaded */}
        {currentWord ? (
          <WordCard wordData={currentWord} handleNext={handleNext} />
        ) : (
          <p>Loading word...</p>
        )}
      </div>
    </div>
  );
}

export default App;
