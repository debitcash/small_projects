import "./styles/generalStyle.css"
import { populateHome } from "./populateHome.js"
import { populateMenu } from "./populateMenu.js";
import { populateContact} from "./populateContact.js";

let homeButton = document.querySelector(".homeButton");
let menuButton = document.querySelector(".menuButton");
let contactButton = document.querySelector(".contactButton");

homeButton.addEventListener("click", () => {
    populateHome();
});

menuButton.addEventListener("click", () => {
    populateMenu();
});

contactButton.addEventListener("click", () => {
    populateContact();
});


homeButton.click();

function mutateBorder(){
    let container = document.querySelector(".content");
    container.style.borderRadius = `${getRandomPercentage()}% ${getRandomPercentage()}%
             ${getRandomPercentage()}% ${getRandomPercentage()}%`;
}

function getRandomPercentage(){
     return Math.random() * 70;
}

setInterval(mutateBorder, 2500); 