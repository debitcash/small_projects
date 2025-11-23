import {shipFactory} from "./ship.js";

let shipObj = shipFactory(5, 3, false);

test("Existence of ship module", () =>{
	expect(shipObj).toBeDefined();
});

test("Existence of hit functionality", () => {
	expect(shipObj.hit).toBeDefined();
});

test("Able to check if the ship is sunk", () => {
	expect(shipObj.isSunk).toBeDefined();
});

test("Not sunk before complete hitting", () =>{
	expect(shipObj.isSunk()).toEqual(false);
});

test("Should be sunk after 3 hits", () => {
	shipObj.hit();
	shipObj.hit();
	expect(shipObj.isSunk()).toEqual(true);
});
