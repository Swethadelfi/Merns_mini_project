import React, { useState, useEffect } from "react";
import "./App.css";

const choices = ["🪨 Rock", "📄 Paper", "✂️ Scissors"];

const getResult = (user, comp) => {
  if (user === comp) return "It's a Draw!";
  if (
    (user === "Paper" && comp === "Rock") ||
    (user === "Scissors" && comp === "Paper")
  ) return "You Win! 🎉";
  return "You Lose 😢";
};
const playSound = (result) => {
  // Choose correct extension for each sound
  const ext = result === "win" ? "wav" : result === "lose" ? "wav" : "mp3";
  const audio = new Audio(`/sounds/${result}.${ext}`);

  audio.onerror = () => console.error(`Failed to load: ${result}.${ext}`);
  audio.play();
};

function App() {
  const [userChoice, setUserChoice] = useState("");
  const [compChoice, setCompChoice] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
  }, [score, highScore]);

  const playGame = (choice) => {
    const user = choice.split(" ")[1];
    const comp = choices[Math.floor(Math.random() * 3)].split(" ")[1];
    const outcome = getResult(user, comp);

    setUserChoice(choice);
    setCompChoice(`🤖 ${comp}`);
    setResult(outcome);

    playSound(outcome.includes("Win") ? "win" : outcome.includes("Lose") ? "lose" : "draw");

    if (outcome.includes("Win")) setScore((prev) => prev + 1);
    else if (outcome.includes("Lose")) setScore((prev) => prev - 1);

    setHistory((prev) => [{ user, comp, result: outcome }, ...prev.slice(0, 4)]);
  };

  const resetGame = () => {
    setUserChoice("");
    setCompChoice("");
    setResult("");
    setScore(0);
    setHistory([]);
    localStorage.removeItem("highScore");
    setHighScore(0);
  };

  return (
    <div className="game-container">
      <h1>Rock Paper Scissors</h1>
      <div className="scoreboard">
        <span>Score: {score}</span> | <span>🏆 High Score: {highScore}</span>
      </div>

      <div className="choices">
        {choices.map((item) => (
          <button key={item} className="choice-btn" onClick={() => playGame(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="results-box animate">
        <p><strong>You:</strong> {userChoice || "-"}</p>
        <p><strong>Computer:</strong> {compChoice || "-"}</p>
        <h2 className="result-msg">{result}</h2>
      </div>

      <div className="history-box">
        <h3>Match History (Last 5)</h3>
        <ul>
          {history.map((h, i) => (
            <li key={i}>You: {h.user} | Comp: {h.comp} → {h.result}</li>
          ))}
        </ul>
      </div>

      <button className="reset-btn" onClick={resetGame}>🔄 Reset Game</button>
    </div>
  );
}

export default App;
