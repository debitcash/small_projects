import "./styles.css"

import { playerFactory } from "./player.js"
import { uiManipulatorFactory } from "./uiManipulator.js"

let activePlayer = playerFactory();
let waitingPlayer = playerFactory();

let uiManipulator = uiManipulatorFactory(activePlayer, waitingPlayer);

uiManipulator.startNewGame();