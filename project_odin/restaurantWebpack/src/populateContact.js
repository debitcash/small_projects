import { populateWithInfo } from "./populateWithInfo";
import imgPath from "./images/contact.png"

let header = "You can find us on the third avenue right behind the dutch tavern";
let text = `Phone: 2508473883 <br>Email: frosty_pants@rest.com`;

let containerStyle = `background-color: #F4E2B6;
    height: 600px;
    width: 600px;
    box-shadow: 70px 50px 70px black;
    display:grid;
    grid-template-columns: 2fr 1fr ;
    justify-items: center;
    align-items:center;
    overflow:hidden;
    transition: border-radius 2.5s linear;`;

let imgStyle = `width:100%;
    height:100%;
    margin: 0 auto;`;

let span1Style = `
    font-size: 2rem;
    text-align:left;
    margin-left:5px;`;

let span2Style = `
    font-size: 2rem;
    text-align:left;
    grid-column: 1/-1;
    text-align:center;`;

export let populateContact = () => {
    populateWithInfo(header, text, imgPath, containerStyle=containerStyle, imgStyle=imgStyle, 
        span1Style=span1Style, span2Style=span2Style);
};