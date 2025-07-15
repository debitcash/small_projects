let symbolContainers = document.querySelectorAll(".symbolContainer");

function createPlayer(symbol, name){
    let score = 0;

    const incrementScore = () => {
        score++;
    }
    
    const getScore = () => score;
    const resetScore = () => {score = 0};

    return {incrementScore, getScore, resetScore};
}

const gameboard = (function(){
    let board = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];

    // reset all the containers
    function reset(){
        for (let row = 0; row < board.length; row++){
            for (let column =0; column < board[row].length; column++){
                board[row][column] = "_";
                let markContainer = document.querySelector(`.location${row + 1}${column + 1}`);
                markContainer.replaceChildren();
                markContainer.style.backgroundColor = "#F0EAD6";
            }
        }
    }

    function makeMove(y, x, turnSymbol){
        board[y - 1][x - 1] = turnSymbol;
    }

    function checkIsEndGame(){
        let isEndGame = true;
        let path = [];

        // horizontal check
        for (let row = 0; row < board.length; row++){
            for (let column = 1; column < board[row].length; column++){
                if (board[row][column] != board[row][column -1] || board[row][column] == "_"){
                    isEndGame = false;
                    path = [];
                    break;
                }
                
                path.push(row + " " + (column - 1));

                if (column === board[row].length - 1){
                    path.push(row + " " + column );
                    highlightPath();

                    return true;
                }
            }
        }

        // vertical check
        for (let column = 0; column < board[0].length; column++){
            for (let row = 1; row < board.length; row++){
                if (board[row][column] != board[row - 1][column] || board[row][column] == "_"){
                    isEndGame = false;
                    path = [];
                    break;
                }

                path.push(row - 1 + " " + (column));

                if (row === board[column].length - 1){
                    path.push(row + " " + column );
                    highlightPath();
                    return true;
                }
            }
        }

        // cross checks
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] != "_"){
            path.push(0 + " " + 0);
            path.push(1 + " " + 1);
            path.push(2 + " " + 2);
            highlightPath();

            return true;
        }

        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[1][1] != "_"){
            path.push(0 + " " + 2);
            path.push(1 + " " + 1);
            path.push(2 + " " + 0);
            highlightPath();
            
            return true;
        }

        function highlightPath(){
            for(let i = 0; i < path.length; i++){
                let row = parseInt(path[i].split(" ")[0]) + 1;
                let column = parseInt(path[i].split(" ")[1]) + 1;
    
                let pathTile = document.querySelector(`.location${row}${column}`);
                pathTile.style.backgroundColor = "red";
            }
        }
    }
    return {makeMove, checkIsEndGame, reset};
})();

const gameflow = (function(){
    let turnSymbol = "X"; 

    let xPlayer;
    let oPlayer;

    let gameStarted = false;

    function startGameLoop(xName, oName){
        gameStarted = true;
        xPlayer = createPlayer("X", xName);
        oPlayer = createPlayer("O", oName);
    }

    function selectionHappened(markedContainer, y, x){
        if (!gameStarted){
            return;
        }

        if (markedContainer.children.length > 0){
            console.log("Place already occupied, terminating execution!");
            return;
        }

        // add proper svg to the selected container
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            turnSymbol == 'X' ? path.setAttribute("d", "M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z")
                                        : path.setAttribute("d", "M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z");
        svg.appendChild(path);        

        markedContainer.appendChild(svg);

        // represent the move in array
        gameboard.makeMove(y, x, turnSymbol);

        if (gameboard.checkIsEndGame()){
            let winner = turnSymbol == 'X' ? xPlayer : oPlayer;
            gameStarted = false;
            winner.incrementScore();
            uiManipulator.updateScoreCount(xPlayer.getScore(), oPlayer.getScore());
        }
        turnSymbol = turnSymbol == 'X' ? 'O':'X';

        uiManipulator.highligthCurrentPlayer(turnSymbol);
    }
    
    function onFinishSessionClicked(){
        xPlayer.resetScore();
        oPlayer.resetScore();
        gameboard.reset();
        gameStarted = false;
    }
    
    function onResetButtonClicked(){
        gameStarted = true;
        gameboard.reset();
    }

    return {startGameLoop, selectionHappened, onFinishSessionClicked ,onResetButtonClicked};
})()


symbolContainers.forEach((markedContainer) => {
    markedContainer.addEventListener("click", () =>{
        let lastClassName = markedContainer.classList[1];
        gameflow.selectionHappened(markedContainer, parseInt(lastClassName[lastClassName.length - 2]) , parseInt(lastClassName[lastClassName.length - 1]));
    })
});

let uiManipulator = (function(){
    function populatePlayers(xName, oName){
        let xContainer = preparePlayerStatsContainer(xName);
        let oContainer = preparePlayerStatsContainer(oName);

        let body = document.querySelector("body");
        body.prepend(xContainer);
        body.appendChild(oContainer);
    }

    function highligthCurrentPlayer(turnSymbol){
        let selectPseudoClass = turnSymbol == "X" ? "first" : "last" ;
        let deselectPseudoClass = turnSymbol == "O" ? "first" : "last" ;

        playerContainer = document.querySelector(`.playerInfo:${selectPseudoClass}-of-type`);
        playerContainer.style.backgroundColor = "#A3C4BC";
        playerContainer.style.borderRadius = "5px";

        playerContainer = document.querySelector(`.playerInfo:${deselectPseudoClass}-of-type`);
        playerContainer.style.backgroundColor = "#F0EAD6";
    }

    function populateControlButtons(){
        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttonContainer");

        let resetGameButton = document.createElement("button"); 
        let endSessionButton = document.createElement("button");

        resetGameButton.textContent = "Reset Board";
        endSessionButton.textContent = "End Session";

        buttonContainer.appendChild(resetGameButton);
        buttonContainer.appendChild(endSessionButton);
        document.querySelector(".centralContainer").appendChild(buttonContainer);
        
        resetGameButton.addEventListener('click', () => {
            gameflow.onResetButtonClicked();
        });

        endSessionButton.addEventListener('click', () => {
            gameflow.onFinishSessionClicked();

            resetGameButton.remove();
            endSessionButton.remove();

            document.querySelector("body > div:nth-child(1)").remove();
            document.querySelector("body > div:nth-child(2)").remove();

            addStartButton();
        });
    }

    function preparePlayerStatsContainer(name){
        let playerStatsContainer = document.createElement("div");
        playerStatsContainer.classList.add("playerInfo");
        let nameSpan = document.createElement("span");
        let scoreSpan = document.createElement("span");

        nameSpan.textContent = name;
        scoreSpan.textContent = "0";

        playerStatsContainer.appendChild(nameSpan);
        playerStatsContainer.appendChild(scoreSpan);

        return playerStatsContainer;
    }

    function updateScoreCount(xScore, oScore){
        let xScoreSpan = document.querySelector("body > div:nth-child(1) span:nth-child(2)");
        let oScoreSpan = document.querySelector("body > div:nth-child(3) span:nth-child(2)");

        xScoreSpan.textContent = xScore;
        oScoreSpan.textContent = oScore;
    }

    function addStartButton(){
        let centralContainer = document.querySelector(".centralContainer");
        let startButton = document.createElement("button");
        startButton.classList.add("startButton");
        startButton.textContent = "Start Game";
        centralContainer.prepend(startButton);

        startButton.addEventListener("click", () => {
            let xName = prompt("Provide the username for 'X' player");
            let oName = prompt("Provide the username for 'O' player");

            if (xName == "" || oName == "" || xName == null || oName == null){
                alert("Please ensure both names are provided!")
                return;
            }

            gameflow.startGameLoop(xName, oName);
            populatePlayers(xName, oName);
            populateControlButtons()

            highligthCurrentPlayer("X");
            startButton.remove();
        });
    }

    return{updateScoreCount, highligthCurrentPlayer, addStartButton};
})();

uiManipulator.addStartButton();