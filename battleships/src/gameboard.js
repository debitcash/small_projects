export { gameboardFactory }
import { shipFactory } from "./ship"

let gameboardFactory = () => {
	let board = Array.from({ length: 10 }, () => Array(10).fill(""));

	let requiredShips = {2:1, 3:2, 4:1, 5:1};
	let placedShips = {2:0, 3:0, 4 :0, 5:0};

	let alreadyShotCoordinates = [];

	function placeShip(mousePath){
		let ship = shipFactory(mousePath.length, 0, false);

		mousePath.forEach((coordinates) => {
			board[coordinates[0]][coordinates[1]] = ship;
		});

		placedShips[mousePath.length] += 1;
	};

	function receiveAttack(coords){
		let value = board[coords[0]][coords[1]];
		
		if (value === ""){
			board[coords[0]][coords[1]] = "miss";
			return false;
		}

		if (value === "miss"){
			return false;
		}
		
		if (value === "shipwreck"){
			return false;
		}
		
		value.hit();
		board[coords[0]][coords[1]] = "shipwreck";
		return true;
	};

	function allShipsAreSunk(){
		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++){
				let value = board[i][j];
				if (typeof value != 'string'){
					return false ;
				}
			}
		}
		return true;
	};

	function getDataStructure(){
		return board;
	};

	function resetBoard(){
		for (let i = 0; i < 10; i++){
			for (let j = 0; j < 10; j++){
				board[i][j] = "";
			}
		}

		placedShips = {2:0, 3:0, 4:0, 5:0};
		alreadyShotCoordinates = [];
	};

	function verifyCoordinates(path){
		if (path.length > 5 || path.length < 2)
			return false;

		if (!isVerticalOrHorizontalPath(path))
			return false;

		if (!requiredShips[path.length] > placedShips[path.length]){
			return false;
		}

		for (let coordinates of path){
			let possibleOccupiedVectors = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,0],[-1,1],[-1,-1]];

			for (let vector of possibleOccupiedVectors){
				let x = coordinates[0] + vector[0];
				let y = coordinates[1] + vector[1];			

				if (x >= 0 && y >= 0 && x < 10 && y < 10 && board[x][y] != ""){
					return false;
				}
			}
		}
		return true;
	}

	function isVerticalOrHorizontalPath(path){
		let column = path[0][0];
		let row = path[0][1];

		let isVertical = true;
		let isHorizontal = true;

		for (let coordinates of path){
			if (coordinates[0] != column){
				isVertical = false;
				break;
			}
		};

		for (let coordinates of path){
			if (coordinates[1] != row){
				isHorizontal = false;
				break;
			}
		};

		return isVertical || isHorizontal;
	}

	function checkProperShipsQuantity(){
		return JSON.stringify(requiredShips) === JSON.stringify(placedShips);
	}

	function generateShotCoordinates(){
		let x, y;

		let used = alreadyShotCoordinates.map(element => element.toString());

		do {
			x = Math.floor(Math.random() * 10);
        	y = Math.floor(Math.random() * 10);
		} 
		while (used.includes(`${x},${y}`));

		alreadyShotCoordinates.push([x,y]);

		return [x,y];
	}

	function generateNearbyShotCoordinates(coordinates){
		let x = coordinates[0];
		let y = coordinates[1];

		let possibleOccupiedVectors = [[1,0],[0,1],[0,-1],[-1,0] ];

		let used = alreadyShotCoordinates.map( element => element.toString());

		for (let vector of [...possibleOccupiedVectors].sort(() => Math.random() - 0.5)){ 
			let nx = x + vector[0];
			let ny = y + vector[1];

			if (!used.includes(`${nx},${ny}`) && nx >= 0 && nx < 10 && ny >= 0 && ny < 10){
				alreadyShotCoordinates.push(coordinates);
				return [nx,ny];
			}
		}

		return generateShotCoordinates(coordinates);
	}

	function populateBoardRandomly(){
		let verticalVectors = [[0,-1],[0,0],[0,1]];
		let horizontalVectors = [[-1,0],[0,0],[1,0]];

		const directions = {
			vertical: { dx: 1, dy: 0, vectors:verticalVectors },
			horizontal: { dx: 0, dy: 1, vectors:horizontalVectors }
		};

		Object.keys(placedShips).forEach( (key) => {
			while(placedShips[key] < requiredShips[key]){
				let orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
				let { dx, dy, vectors} = directions[orientation]

				let x = Math.floor(Math.random() * 10) - dx;
        		let y = Math.floor(Math.random() * 10) - dy;

				let endX = x + dx * (1 + +key);
				let endY = y + dy * (1 + +key);

				if (endX > 9 || endY > 9 || x < 0 || y < 0){
					continue;
				}

				let path = []
				let noCellBlockage = true;

				for (let step = 0; step <= +key + 1; step++){
					let newX = x + dx * step;
					let newY = y + dy * step;

					if (cellBlocked(newX, newY, vectors)){
						noCellBlockage = false;
						break;
					}

					path.push([newX, newY]);
				}
				
				if (!noCellBlockage) continue;

				placeShip(path.slice(1, -1));
			}
		});
	}

	function cellBlocked(x, y, adjacentVectors){
		for (let [vx, vy] of adjacentVectors){
			let checkX = x + vx;
			let checkY = y + vy;

			if (board[checkX] &&  board[checkX][checkY] != undefined && board[checkX][checkY] != ""){
				return true;
			}
		}
		return false;
	}

	return { populateBoardRandomly, generateNearbyShotCoordinates, 
		generateShotCoordinates, checkProperShipsQuantity,
		placeShip, allShipsAreSunk, receiveAttack, getDataStructure, resetBoard, 
		verifyCoordinates };
};