import { populateWithInfo } from "./populateWithInfo";
import imgPath from "./images/home.png"

let header = "Welcome to the Frosty Pants!";
let text = `A quirky underwater diner run by best friends SpongeBob and Patrick.
It’s wildly fun, questionably clean, but full of heart. Expect chaotic service, bizarre specials
like jellyfish jelly fries, and lots of laughs. Perfect for Bikini Bottom's coolest foodies!`;

let containerStyle = `background-color: #F4E2B6;
    height: 600px;
    width: 600px;
    padding:30px;
    transition: border-radius 2.5s linear;
    box-shadow: 70px 50px 70px black;
    overflow:hidden;`;

let imgStyle = `width:50%;
    height:50%;
    display:block;
    margin-right: 20px;
    border-radius: 5%;
    margin: auto;`;

let span1Style = `font-size: 2rem;
    display: block;
    margin-top:20px;
    text-align: center;`;

let span2Style = `display:block;
    font-size: 1.5rem;
    margin-top:20px;
    text-align: center;`;

export let populateHome = () => {
    populateWithInfo(header, text, imgPath, containerStyle=containerStyle, imgStyle=imgStyle, 
        span1Style=span1Style, span2Style=span2Style);
};