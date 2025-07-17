const myLibrary = [];

class Book {
    constructor(author, title, pages, isRead){
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.isRead = isRead;
    this.height = `${ Math.random() * (90 - 40) + 40}%`;
    this.id = crypto.randomUUID();
    this.bookColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    }
}
Book.longestPages = 1200;

function addBookToLibrary(author, title, pages, isRead){
    let newBook = new Book(author, title, pages, isRead);
    myLibrary.push(newBook);
}

addBookToLibrary("Antonio Banderas", "Auto style", 100, true);
addBookToLibrary("Brianka Censori", "Bad Influence", 200, false);
addBookToLibrary("Coby Bryant", "Clear Doubts", 350, false);
addBookToLibrary("Danny Devito", "Unbreakable", 400, true);

let readContainer = document.querySelector(".readContainer");
let unreadContainer = document.querySelector(".unreadContainer");

populateShelf();

function populateShelf(){
    for (let i = 0; i < myLibrary.length; i++){
        displayBook(myLibrary[i]);
    }
}

function displayBook(book){
    let bookDiv = document.createElement("div");
    bookDiv.className = "book";

    let portionalWidth = book.pages / Book.longestPages;
    bookDiv.style.width = `${200 * portionalWidth}px`;
    bookDiv.style.height = book.height;
    bookDiv.style.backgroundColor = book.bookColor;

    bookDiv.addEventListener("mouseenter", (event) => {
        let controlContainer = document.createElement("div");
        
        let removeImg = document.createElement("img");
        let toggleImg = document.createElement("img");

        removeImg.src = "images/remove.png";
        toggleImg.src = "images/swap.png";

        removeImg.width = "30";
        toggleImg.width = "30";
        controlContainer.style.height = "60px";

        controlContainer.appendChild(toggleImg);
        controlContainer.appendChild(removeImg);

        bookDiv.prepend(controlContainer);

        removeImg.addEventListener("click", (event) => {
            bookDiv.remove();
            removeFromLibrary(book);
        });

        toggleImg.addEventListener("click", (event) => {
            bookDiv.remove();
            book.isRead= !book.isRead;
            displayBook(book);
        });
    });

    bookDiv.addEventListener("mouseleave", (event) => {
        bookDiv.removeChild(bookDiv.firstChild);
    });

    [book.author, book.title, book.pages].forEach(text => {
            const infoSpan = document.createElement("span");
            infoSpan.textContent = text;
            bookDiv.appendChild(infoSpan);
        });

    if (book.isRead){
        readContainer.appendChild(bookDiv);
    }
    else{
        unreadContainer.appendChild(bookDiv);
    }
}

function removeFromLibrary(book){
    for (let i = 0; i < myLibrary.length; i++){
        if (myLibrary[i].id === book.id){
            myLibrary.splice(i, 1);
        }
    }
}

// form logic portion
const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".header img");
const closeButton = document.querySelector("dialog button");

showButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
    console.log(document.querySelector("#authorInput").innerText);
    
  dialog.close();
});

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log(document.querySelector("#authorInput").value);
    console.log(document.querySelector("#titleInput").value);
    console.log(document.querySelector("#pagesInput").value);
    console.log(document.querySelector("#isReadInput").checked);

    let author = document.querySelector("#authorInput").value;
    let title = document.querySelector("#titleInput").value;
    let pages = document.querySelector("#pagesInput").value;
    let isRead = document.querySelector("#isReadInput").checked;
    
    addBookToLibrary(author, title, parseInt(pages), isRead);
    displayBook(myLibrary[myLibrary.length - 1]);
    form.reset();
});