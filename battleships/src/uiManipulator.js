export { uiManipulatorFactory }

let uiManipulatorFactory = (activePlayer, waitingPlayer) => {

	let gameControlContainer = document.querySelector(".gameControlContainer");
	let boardsContainer = document.querySelector(".boardsContainer");

	let opponentSelection = "";
	let inTransition = true;
	
	function greyoutTheBoards(){
		let boardElement1 = document.querySelector(".activePlayerBoard");
		let boardElement2 = document.querySelector(".waitingPlayerBoard");
		
		boardElement1.innerHTML = "";
		boardElement2.innerHTML = "";
	}

	function displayActivePlayerBoard(board){
		let boardDataStructure = board.getDataStructure();
		
		let boardElement = document.querySelector(".activePlayerBoard");
		boardElement.innerHTML = "";

		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++){
				let square = document.createElement("div");
				square.style.border = "2px solid black";

				square.setAttribute ("coordinates", `${i}${j}`);

				boardElement.appendChild(square);

				let squareDescription = boardDataStructure[i][j]

				if (squareDescription == "miss")
				{
					square.style.backgroundColor = "red";
				}

				else if (squareDescription == "shipwreck"){
					square.style.backgroundColor = "grey";
				}

				else if (squareDescription == ""){
					square.style.backgroundColor = "#f6f6f6";
				}

				else {
					square.style.backgroundColor = "purple";
				}
			}
		}
	};

	function displayWaitingPlayerBoard(board){
		let boardDataStructure = board.getDataStructure();
		
		let boardElement = document.querySelector(".waitingPlayerBoard");
		boardElement.innerHTML = "";

		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++){
				let square = document.createElement("div");
				square.style.border = "2px solid black";

				square.setAttribute ("coordinates", `${i}${j}`);

				square.addEventListener("click", () => {
					if (!board.receiveAttack([i, j])){
						displayWaitingPlayerBoard(board);
						disableAllListeners();
					}
					else {
						displayWaitingPlayerBoard(board);

						if (board.allShipsAreSunk()){
							
							setTimeout(() => {
								alert("Battle Finished!");
								startNewGame();
							}, 50);
						}
					}
				});

				boardElement.appendChild(square);

				let squareDescription = boardDataStructure[i][j]

				if (squareDescription == "miss")
				{
					square.style.backgroundColor = "red";
				}
				else if (squareDescription == "shipwreck"){
					square.style.backgroundColor = "grey";
				}
			}
		}
	};

	function startNewGame(){
		boardsContainer.innerHTML = "";

		activePlayer.gameboard.resetBoard();
		waitingPlayer.gameboard.resetBoard();

		let formString = `<form>
				<select name="player1" id="opponentSelection">
					<option value="ai">AI</option>
					<option value="human">Human</option>
				</select>
				<button>Submit</button>
			</form>`;

		gameControlContainer.innerHTML = formString;

		let formButton = document.querySelector("button");

		formButton.addEventListener("click", (event) => {
    		event.preventDefault();

			opponentSelection = document.querySelector("#opponentSelection").value;

			prepareBoardForInput(activePlayer);

			createControlButton("Done").addEventListener("click", () => {
				if (!activePlayer.gameboard.checkProperShipsQuantity()){
					return;
				}
				boardsContainer.innerHTML = "";

				if (opponentSelection == "ai"){
					waitingPlayer.gameboard.populateBoardRandomly();
					createStartGameButton();
					return;
				}

				prepareBoardForInput(waitingPlayer);

				createControlButton("Done").addEventListener("click", () => {
					if (!waitingPlayer.gameboard.checkProperShipsQuantity()){
						return;
					}
					boardsContainer.innerHTML = ""; 

					createStartGameButton();					
				});
			});
		});
	}

	function createStartGameButton(){
					createControlButton("Start Game").addEventListener("click", () => {
						boardsContainer.innerHTML =`<div class="activePlayerBoard"></div> <div class="waitingPlayerBoard"></div>`;
						displayActivePlayerBoard(activePlayer.gameboard);
						displayWaitingPlayerBoard(waitingPlayer.gameboard);

						createControlButton("Next Turn").addEventListener("click", () => {
							if (opponentSelection != "ai"){
								if (inTransition){
									greyoutTheBoards();
									inTransition = false;
								}

								else{
									let temp = activePlayer;
									activePlayer = waitingPlayer;
									waitingPlayer = temp;

									displayActivePlayerBoard(activePlayer.gameboard);
									displayWaitingPlayerBoard(waitingPlayer.gameboard);

									inTransition = true;
								}
							}

							else{
								let shotCoordinates = waitingPlayer.gameboard.generateShotCoordinates();

								while (activePlayer.gameboard.receiveAttack(shotCoordinates)){
									if (activePlayer.gameboard.allShipsAreSunk()){
										
										setTimeout(() => {
											alert("Game ended!");
											startNewGame();
										}, 50);
										return;
									}
									shotCoordinates = waitingPlayer.gameboard.generateNearbyShotCoordinates(shotCoordinates);
								}
								displayActivePlayerBoard(activePlayer.gameboard);
								displayWaitingPlayerBoard(waitingPlayer.gameboard);
							}
						});
					});
	}

	function createControlButton(buttonText){
		let newButton = document.createElement("button");
		newButton.textContent = buttonText;

		gameControlContainer.innerHTML = "";
		gameControlContainer.appendChild(newButton);

		return newButton;
	}

	function prepareBoardForInput(player){
		let inputBoard = document.createElement("div");
		inputBoard.className = "inputBoard";
		
		boardsContainer.appendChild(inputBoard);

		let startSquareClicked = false;

		let mousePath = [];

		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++){
				let square = document.createElement("div");
				square.style.border = "2px solid black";

				square.setAttribute ("coordinates", `${i}${j}`);

				square.addEventListener("mousedown", () => {
					startSquareClicked = true;
					square.style.backgroundColor = "red";
					mousePath.push([i, j]);
				});

				square.addEventListener("mouseover", () => {
					if (startSquareClicked){
						square.style.backgroundColor = "pink";
						mousePath.push([i,j]);
					}
				});

				square.addEventListener("mouseup", () => {
					startSquareClicked = false;

					if (player.gameboard.verifyCoordinates(mousePath)){
						player.gameboard.placeShip(mousePath);
						mousePath = [];
					}
					else{
						cleanupPath(mousePath);
						mousePath = [];
					}
				});
				inputBoard.appendChild(square);
			}
		}
	}

	function cleanupPath(mousePath){
		mousePath.forEach((location) => {
			let square = document.querySelector(`div[coordinates="${location[0]}${location[1]}"]`);
			square.style.backgroundColor = "white";
		});
	}

	function disableAllListeners(){
		let activeSquares = document.querySelectorAll(".waitingPlayerBoard div");

		activeSquares.forEach((square) => {
			let newElement = square.cloneNode(true);
			square.parentNode.replaceChild(newElement, square);
		});
	}

	return { displayActivePlayerBoard, 
		displayWaitingPlayerBoard, startNewGame };
};
