import React, { useState, useEffect  } from "react";

const WordCard = ({ wordData, handleNext }) => {
    const { Word, Definition, Right, Wrong } = wordData;
    const [showDefinition, setShowDefinition] = useState(false); // State to track if the definition is visible

    const toggleDefinition = () => {
    setShowDefinition(!showDefinition); // Toggle the visibility of the definition
    };

    const handleKnow = () => {
    // Handle the "Know" button click (could add custom logic if needed)
    handleNext();
    };

    const handleDontKnow = () => {
    // Handle the "Don't Know" button click (could add custom logic if needed)
    handleNext();
    };

    // Reset showDefinition to false when wordData changes
    useEffect(() => {
        setShowDefinition(false); // Reset definition visibility when the word changes
        }, [wordData]); // Dependency array ensures this only runs when wordData changes
    

    return (
    <div className="word-card">
        <div className="status">
        <span className="wrong" style={{ color: "red" }}>
            Wrong: {Wrong}
        </span>
        <span className="right" style={{ color: "green" }}>
            Right: {Right}
        </span>
        </div>
        <h2>{Word}</h2>
        {showDefinition && (
        <p
            className="definition"
            dangerouslySetInnerHTML={{
            __html: Definition.replace(/\\u00a0/g, '&nbsp;').replace(/\n/g, '<br />'),
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
