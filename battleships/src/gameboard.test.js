import { gameboardFactory} from "./gameboard.js"

test("Existence of board factory", () => {
	expect(gameboardFactory).toBeDefined();
});

test("Existence of gameboar ship placement method", () => {
	let board = gameboardFactory();
	expect(board.placeShip).toBeDefined();
});

test("Test one square ships interaction. Place and sink ships at 11 and 12", () => {
	let gameBoard = gameboardFactory();
	gameBoard.placeShip([[1, 1]]);	
	gameBoard.placeShip ([[1, 2], [1, 2]]);

	gameBoard.receiveAttack([1,1]);
	gameBoard.receiveAttack([1, 2]);
	
	expect(gameBoard.allShipsAreSunk()).toEqual(true);
});

test("Test multiple square horizontal ships 2,3,4. Place and sink ships at 01/02, 04/06, 20/23, 25/28", () => {
	let gameBoard = gameboardFactory();
	
	gameBoard.placeShip([[0, 1], [0, 2]]);	
	gameBoard.placeShip([[0, 4], [0,5], [0, 6]]);
	gameBoard.placeShip([[2, 0], [2,1], [2,2], [2, 3]]);
	gameBoard.placeShip([[2,5], [2,6], [2,7], [2, 8]]);

	gameBoard.receiveAttack([0,1]);
	gameBoard.receiveAttack([0,2]);
	
	gameBoard.receiveAttack([0, 4]);
	gameBoard.receiveAttack([0, 5]);
	gameBoard.receiveAttack([0, 6]);
	
	gameBoard.receiveAttack([2, 0]);
	gameBoard.receiveAttack([2, 1]);
	gameBoard.receiveAttack([2, 2]);
	gameBoard.receiveAttack([2, 3]);
	
	gameBoard.receiveAttack([2, 5]);
	gameBoard.receiveAttack([2, 6]);
	gameBoard.receiveAttack([2, 7]);
	gameBoard.receiveAttack([2, 8]);

	
	expect(gameBoard.allShipsAreSunk()).toEqual(true);
});

test("Test multiple square vertical ships 2,3,4. Place and sink ships at 00/10, 30/50, 02/32, 24/54", () => {
	let gameBoard = gameboardFactory();
	
	gameBoard.placeShip([[0, 0], [1, 0]]);	
	gameBoard.placeShip([[3, 0], [4,0], [5, 0]]);
	gameBoard.placeShip([[0, 2], [1,2], [2,2], [3, 2]]);
	gameBoard.placeShip([[2, 4], [3,4], [4,4], [5, 4]]);

	gameBoard.receiveAttack([0,0]);
	gameBoard.receiveAttack([1,0]);

	gameBoard.receiveAttack([3,0]);
	gameBoard.receiveAttack([4,0]);
	gameBoard.receiveAttack([5,0]);

	gameBoard.receiveAttack([0,2]);
	gameBoard.receiveAttack([1,2]);
	gameBoard.receiveAttack([2,2]);
	gameBoard.receiveAttack([3,2]);

	gameBoard.receiveAttack([2,4]);
	gameBoard.receiveAttack([3,4]);
	gameBoard.receiveAttack([4,4]);
	gameBoard.receiveAttack([5,4]);

	expect(gameBoard.allShipsAreSunk()).toEqual(true);
});


test("Existence of method to randomly populate the board", () => {
	let gameBoard = gameboardFactory();
	expect(gameBoard.populateBoardRandomly).toBeDefined();
});

test("Test if after the random population 5+4+3+3+2 = 17 are occupied", () => {
	let gameBoard = gameboardFactory();
	gameBoard.populateBoardRandomly();

	let board = gameBoard.getDataStructure();

	let count = 0;

	for (let i = 0; i < 10; i++){
		for (let j=0; j < 10; j++){
			if (board[i][j]){
				count ++;
			}
		}
	}

	expect(count).toEqual(17);
});

test("Existence of nearby shot method", () => {
	let gameBoard = gameboardFactory();

	expect(gameBoard.generateNearbyShotCoordinates).toBeDefined();
});

test("Check if nearby shots are actually nearby", () => {
	let gameBoard = gameboardFactory();

	let coords = gameBoard.generateNearbyShotCoordinates([1,1]);

	let xCheck = (coords[0] == 2 || coords[0] == 1 || coords[0] == 0);
	let yCheck = (coords[1] == 2 || coords[1] == 1 || coords[1] == 0);

	expect(xCheck).toEqual(true);
	expect(yCheck).toEqual(true);
});

test("Existence of nearby shot method", () => {
	let gameBoard = gameboardFactory();

	expect(gameBoard.generateShotCoordinates).toBeDefined();
});

test("Check if randomly generated shot is within the board", () => {
	let gameBoard = gameboardFactory();

	let coords = gameBoard.generateShotCoordinates();

	let xCheck = (coords[0] < 10 && coords[1] >= 0);
	let yCheck = (coords[1] < 10 && coords[1] >= 0);

	expect(xCheck).toEqual(true);
	expect(yCheck).toEqual(true);
});

test("Existence of proper ship placement mchecker", () => {
	let gameBoard = gameboardFactory();

	expect(gameBoard.checkProperShipsQuantity).toBeDefined();
});

test("Check for right ship population claculation", () => {
	let gameBoard = gameboardFactory();

	gameBoard.placeShip([[0, 1], [0, 2]]);	
	gameBoard.placeShip([[0, 4], [0,5], [0, 6]]);
	gameBoard.placeShip([[2, 0], [2,1], [2,2], [2, 3]]);
	gameBoard.placeShip([[2,5], [2,6], [2,7], [2, 8], [2,9]]);

	expect(gameBoard.checkProperShipsQuantity()).toEqual(false);

	gameBoard.placeShip([[5,5], [5,6], [5,7]]);

	expect(gameBoard.checkProperShipsQuantity()).toEqual(true);
});

test("Existence of proper ship placement mchecker", () => {
	let gameBoard = gameboardFactory();

	expect(gameBoard.verifyCoordinates).toBeDefined();
});

test("Check right and wrong placements with  verify coordinates", () => {
	let gameBoard = gameboardFactory();

	gameBoard.placeShip([[2,5], [2,6], [2,7], [2, 8], [2,9]]);

	expect(gameBoard.verifyCoordinates([[3,6]])).toEqual(false);

	expect(gameBoard.verifyCoordinates([[4,6],[4,7]])).toEqual(true);
});