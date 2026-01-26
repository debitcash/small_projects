export { ScoreContainer }

function ScoreContainer({currentScore=0, bestScore=0}){
    return <>
        <span>Current Score:{currentScore}</span>
        <span>Best Score: {bestScore}</span>
    </>;
}
