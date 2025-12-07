export { playerFactory }

import { gameboardFactory } from "./gameboard.js"

let playerFactory = (providedPlayerType) => {
	let playerType = providedPlayerType;

	return {gameboard:gameboardFactory()};
};

