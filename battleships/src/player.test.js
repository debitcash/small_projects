import { playerFactory } from "./player.js"

test("Existence of player module",() => {
	let module = playerFactory;
	expect(module).toBeDefined();
});
