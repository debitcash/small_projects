import { populateWithInfo } from "./populateWithInfo.js";
import imgPath from "./images/menu.png"

let header = "Checkout the menu";
let text = `All the regular fast food items, but now cheaper and bigger. Forget about "crusty" competition
we are the new standard!`;

let containerStyle = `background-color: #F4E2B6;
    height: 600px;
    width: 600px;
    padding:30px;
    box-shadow: 70px 50px 70px black;
    transition: border-radius 2.5s linear;
    display:flex;
    justify-content: space-evenly;
    flex-direction: column-reverse;
    overflow:hidden;`;

let imgStyle = `height:70%;
    width:70%;
    display:block;
    border-radius: 5%;
    margin: 0 auto;`;

let span1Style = `font-size: 2rem;
    display: block;
    margin-top:20px;
    text-align: center;`;

let span2Style = `display:block;
    font-size: 1.5rem;
    margin-top:20px;
    text-align: center;`;

export let populateMenu = () => {
    populateWithInfo(header, text, imgPath, containerStyle=containerStyle, imgStyle=imgStyle, 
        span1Style=span1Style, span2Style=span2Style);
};