import { useEffect, useState } from 'react'
import { ScoreContainer } from './components/ScoreContainer.jsx'
import { CardContainer } from './components/CardContainer.jsx'

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  function updateBest(){
    setBestScore(Math.max(currentScore, bestScore));
    setCurrentScore(0);
  }

  function updateCurrent(){
    setCurrentScore(currentScore => currentScore + 1);
  }

  return (
    <>
      <header>
          <h1>Pokemon Memory Game</h1>
          <span>Get points by clicking on an image but don't click on any more than once!</span>
          <ScoreContainer currentScore={currentScore} bestScore={bestScore} />
      </header>
      <div className="cards">
        <CardContainer updateCurrent={updateCurrent} updateBest={updateBest}/>
      </div>
    </>
  )
}

export default App
