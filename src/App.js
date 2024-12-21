import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import Sidebar from "./SideBar";
import WordCard from "./WordCard";

function App() {
  const [wordData, setWordData] = useState([]); // Store the array of words
  const [currentWord, setCurrentWord] = useState(null); // Store the currently displayed word

  // Fetch data from Dictionary.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Dictionary.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const updatedData = data.map((word) => ({
          ...word,
          Right: Number(localStorage.getItem(`${word.Word}-Right`) || 0),
          Wrong: Number(localStorage.getItem(`${word.Word}-Wrong`) || 0),
        }));
        setWordData(updatedData);
        setRandomWord(updatedData); // Set the first random word
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
    setCurrentWord(word);
  };

  // Function to update localStorage and state counts
  const updateWordCounts = (word, isCorrect) => {
    const keyRight = `${word.Word}-Right`;
    const keyWrong = `${word.Word}-Wrong`;

    const newRight = isCorrect ? word.Right + 1 : word.Right;
    const newWrong = isCorrect ? word.Wrong : word.Wrong + 1;

    localStorage.setItem(keyRight, newRight);
    localStorage.setItem(keyWrong, newWrong);

    setWordData((prevData) =>
      prevData.map((item) =>
        item.Word === word.Word
          ? { ...item, Right: newRight, Wrong: newWrong }
          : item
      )
    );
  };

  return (
    <div className="App">
      <Sidebar wordData={wordData} onSelectWord={handleSelectWord} />
      <div className="word-card-container">
        <NavBar />
        {currentWord ? (
          <WordCard
            wordData={currentWord}
            handleNext={handleNext}
            updateWordCounts={updateWordCounts}
          />
        ) : (
          <p>Loading word...</p>
        )}
      </div>
    </div>
  );
}

export default App;
