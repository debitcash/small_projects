
export let populateWithInfo = (header, text, imgPath, containerStyle="", imgStyle="", span1Style="", span2Style="") => {
    let container = document.querySelector(".content");
    container.innerHTML = "";
    
    let image = document.createElement("img");
    let textSpan = document.createElement("span");
    let headerSpan = document.createElement("span");

    image.src = imgPath;

    headerSpan.innerHTML = header;
    textSpan.innerHTML = text;

    container.appendChild(image);
    container.appendChild(headerSpan);
    container.appendChild(textSpan);

    container.style.cssText = containerStyle;
    image.style.cssText = imgStyle;
    headerSpan.style.cssText = span1Style;
    textSpan.style.cssText = span2Style;
};