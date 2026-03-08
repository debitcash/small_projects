const { render } = require("ejs");
const db = require("../db/queries");

let credentials = {"login":"admin", "pass":"1111"};

let loggedIn = false;

function verifyPermissions(){
    return loggedIn;
}
exports.authAttempt = (req,res) => {
    const login = req.body.login;
    const pass = req.body.pass;

    console.log("Login and pass are:", login, pass)

    if (credentials.login == login && credentials.pass == pass){
        console.log("Auth GOOD");
        loggedIn = true;
    }
    else{
        console.log("AUTH BAD!!!");
    }

    res.redirect("/");
};

exports.getHomepage = (req, res) => {
    res.render("appliedFilters", {loggedIn:loggedIn});
};

exports.getGenres = async (req, res) => {
    let genresDbRows = await db.getAllGenres();
    let genreNames = [];
    let currentUrl = "/genres";

    genresDbRows.map(genreRow => genreNames.push(genreRow.name));

    res.render("appliedFilters", 
        {genres:genreNames, currentUrl:currentUrl
        });
};

// adds new genre
exports.postGenres = async (req, res) => {
    const newGenreName = req.body.newGenre;
    //console.log("Adding new genre: ", newGenreName);
    await db.createNewGenre(newGenreName);
    res.redirect(req.path);
};

// shows input fields for a genre
exports.getUpdateGenre = async (req, res) => {
    const { genreName } = req.params;
    const currentUrl = "/genres/" + genreName + "?action=update";
    res.render("appliedFilters", 
        {
            currentUrl:currentUrl,
            fieldsToBeUpdated:[{tableColumn:"Name", "value":genreName}]});
        return;
};

// apply changes to a genre
exports.postUpdateGenre = async (req, res) => {
    const actionType = req.query.action;
    const { genreName } = req.params;
    const newName = req.body.Name;
    
    //console.log("Action type is: ", actionType, ". For genre name: ", genreName);

    if (actionType == 'delete'){
        await db.deleteGenreByName(genreName);
    }
    
    else if (actionType == 'update') {
        console.log("GOTTA BE LOGGED IN! THE NEW NAME IS:, ", newName, " OLD IS ", genreName);
        await db.updateGenreName(genreName, newName);
    }

    else if (actionType == 'addBook') {
        const title = req.body.title;
        const author = req.body.author;
        console.log("Adding a new book: ", title, author, " to: ", genreName);

        await db.addBookToGenre(genreName, title, author);
        res.redirect("/genres/" + genreName);
    }

    res.redirect("/genres");
};

exports.getTitlesByGenre = async (req, res) => {
    const { genreName } = req.params;
    console.log("ASKED FOR THE FOLLOWING GENRE: ", genreName);
    let currentUrl = "/genres/" + genreName;

    let genresDbRows = await db.getAllGenres();
    let genreNames = [];
    genresDbRows.map(genreRow => genreNames.push(genreRow.name));

    let titlesDbRows = await db.getTitlesByGenreName(genreName);
    //console.log("GOT THE DB entrie:", titlesDbRows);

    let titles = [];
    //titlesDbRows.map(titleRow => titles.push({name:titleRow.title, id:titleRow.id }));
    titlesDbRows.map(titleRow => titles.push(titleRow.title));
    console.log("GOT THE TITLES:", titles);

    res.render("appliedFilters", 
        {genres:genreNames, 
        titles:titles,
        categories:["Genre", "Author", "Title"],
        genreName:genreName,
        currentUrl:currentUrl
    });
};

exports.getUpdateBook = async (req, res) => {
    const { genreName, bookTitle } = req.params;
    //const currentUrl = "/genres/" + genreName + "?action=update";

    console.log("title is", bookTitle);

    let  { author, id }  = (await db.getAuthorByTitle(bookTitle))[0];

    let currentUrl = "/books/" + id + "?action=update&genreName=" + genreName;

    console.log("Author is: ", author);

    let genresInfo = await db.getAllGenresInfo();

    let correspondingGenres =  await db.getCorrespondingGenres(id);
    let appliedGenreIds = correspondingGenres.map( genreRow => {
        return genreRow.genre_id;
    });

    //console.log(genresInfo);
    //console.log("Currently applied gernes:", appliedGenreIds);

    res.render("appliedFilters", 
        {
            currentUrl:currentUrl,
            fieldsToBeUpdated:[{tableColumn:"Title", "value":bookTitle},
                {tableColumn:"Author", "value":author}
            ],
            genresToBeSelected:genresInfo,
            appliedGenreIds:appliedGenreIds
        });
        return;
};

exports.postUpdateBook = async (req, res) => {
    const actionType = req.query.action;
    const { bookIdentifier, genreName } = req.params;
    const updatedTitle = req.body.Title;
    const updatedAuthor =  req.body.Author;
    let pictureUrl = req.body.pictureUrl;
    let description = req.body.description;
    
    console.log("Action type is: ", actionType, updatedAuthor, updatedTitle);

    if (actionType == 'delete'){
        console.log("BOOKTITLE IS", bookIdentifier);
        await db.deleteBookByName(bookIdentifier);
        if (genreName == undefined)
            res.redirect("/books");
        else
            res.redirect("/genres/" + genreName);
    }
    
    else if (actionType == 'update') {
        //console.log("GOTTA BE LOGGED IN! THE NEW NAME IS:, ", newName, " OLD IS ", genreName);
        let genreName = req.query.genreName;

        console.log("CHOSEN GENRES ARE:", req.body.genresId);

        await db.linkBooksGenres(req.body.genresId, bookIdentifier);

        await db.updateBookRecord(updatedTitle, updatedAuthor, bookIdentifier);
        res.redirect("/genres/" + genreName);
        return;
    }

    else if (actionType == 'addCover') {
        console.log("Picture and descr", pictureUrl, bookIdentifier, description);
        await db.addCoverByTitle(pictureUrl, bookIdentifier, description);
        
        res.redirect(req.path);
        return;
    }

    res.redirect("/");
};

exports.getBookDetails = async (req,res) => {
    const { genreName, bookTitle } = req.params;
    //console.log("ASKED FOR THE FOLLOWING GENRE: ", genreName);
    

    let genresDbRows = await db.getAllGenres();
    let genreNames = [];
    genresDbRows.map(genreRow => genreNames.push(genreRow.name));

    let titlesDbRows = await db.getTitlesByGenreName(genreName);
    //console.log("GOT THE DB entrie:", titlesDbRows);

    let titles = [];
    //titlesDbRows.map(titleRow => titles.push({name:titleRow.title, id:titleRow.id }));
    titlesDbRows.map(titleRow => titles.push(titleRow.title));
    //console.log("GOT THE TITLES:", titles);

    let bookInfo = (await db.getBookInfoByTitle(bookTitle))[0];

    let currentUrl = "/genres/" + genreName + "/" + bookInfo.title;

    console.log("CURENT URL", currentUrl);
    let correspondingGenres = await db.getCorrespondingGenreNames(bookInfo.id);

    let covers = await db.getAllCoversbyBookId(bookInfo.id);
    //console.log("BOOK INFO IS", correspondingGenres);
    let coverIds = covers.map(cover => "" + cover.id);
    console.log("Cover ids are: ", coverIds);

    res.render("appliedFilters", 
        {genres:genreNames, 
        titles:titles,
        categories:["Genre", "Author", "Title"],
        genreName:genreName,
        currentUrl:currentUrl,
        bookInfo:bookInfo,
        correspondingGenres:correspondingGenres,
        //covers:covers,
        coverIds:coverIds
    });
};

exports.getCoverInGenres = async (req,res) => {
    const { bookId, coverId, genreName } = req.params;

    let genresDbRows = await db.getAllGenres();
    let genreNames = [];
    genresDbRows.map(genreRow => genreNames.push(genreRow.name));

    let titlesDbRows = await db.getTitlesByGenreName(genreName);
    //console.log("GOT THE DB entrie:", titlesDbRows);

    let titles = [];
    //titlesDbRows.map(titleRow => titles.push({name:titleRow.title, id:titleRow.id }));
    titlesDbRows.map(titleRow => titles.push(titleRow.title));
    //console.log("GOT THE TITLES:", titles);

    let bookInfo = (await db.getBookInfoById(bookId))[0];

    let currentUrl = "/genres/" + genreName + "/" + bookInfo.title;

    //console.log("CURENT URL", currentUrl);
    let correspondingGenres = await db.getCorrespondingGenreNames(bookInfo.id);

    let covers = await db.getAllCoversbyBookId(bookInfo.id);
    //console.log("BOOK INFO IS", correspondingGenres);
    let coverIds = covers.map(cover => "" + cover.id);
    //console.log("Cover ids are: ", coverIds);

    let imageUrl = (await db.getImageUrlByCoverId(coverId))[0].picture_url;
    //console.log("IMAGEURL BY COVERID IS: ", imageUrl);

    res.render("appliedFilters", 
        {genres:genreNames, 
        titles:titles,
        categories:["Genre", "Author", "Title"],
        genreName:genreName,
        currentUrl:currentUrl,
        bookInfo:bookInfo,
        correspondingGenres:correspondingGenres,
        //covers:covers,
        coverIds:coverIds,
        imageUrl:imageUrl
    });
};

exports.postUpdateCover = async (req,res) => {
    const { bookId, coverId, genreName } = req.params;

    const actionType = req.query.action;

    if (actionType == "delete"){
        
        await db.deleteCoverbyId(coverId);

        let bookInfo = (await db.getBookInfoById(bookId))[0];

        console.log("WANT DTO DELETE!", bookInfo);

        res.redirect("/genres/" + genreName + "/" + bookInfo.title);   
    }

    if (actionType == "update"){
        console.log("REQUEST BODY: ", req.body);
        let genreName = req.query.genre;

        await db.updateCoverRecord(coverId, req.body["Picture Url"], req.body["Book Id"]);

        res.redirect("/genres/" + genreName + "/" + req.query.bookName);   
    }

};

exports.getUpdateCover = async (req,res) => {
    const { bookId, coverId, genreName } = req.params;
    let coverInfo = (await db.getCoverInfoById(coverId))[0];

    let bookName = (await db.getBookInfoById(bookId))[0].title;

    console.log("222222222Got the cover: ", genreName);

    let currentUrl = "/covers/" + coverId + "?action=update&genre=" + genreName + "&bookName=" + bookName;

    res.render("appliedFilters", 
        {
            currentUrl:currentUrl,
            fieldsToBeUpdated:[{tableColumn:"Picture Url", "value":coverInfo.picture_url},
                {tableColumn:"Book Id", "value":coverInfo.book_id}
            ],
        });
        return;

};

exports.getAllBooks = async (req,res) => {
    let books = await db.getAllBooks();

    let bookNames = books.map(book => book.title);

    let genresToBeSelected = await db.getAllGenresInfo();

    res.render("appliedFilters", {
        bookNames:bookNames,
        currentUrl:'/books',
        genresToBeSelected:genresToBeSelected
    });

};

exports.postAllBooks = async (req,res) => {
    const actionType = req.query.action;

    if (actionType == 'addBook') {
        const title = req.body.title;
        const author = req.body.author;
        console.log("Adding a new book: ", title, author, req.body.genresId);

        await db.addBook(title, author, req.body.genresId);
        res.redirect("/books");
    }
};

exports.getBook = async (req,res) => {
    const { bookId } = req.params;


    let books = await db.getAllBooks();

    let bookNames = books.map(book => book.title);

    let genresToBeSelected = await db.getAllGenresInfo();

    

    let bookInfo = (await db.getBookInfoById(bookId))[0];

    let correspondingGenres = await db.getCorrespondingGenreNames(bookInfo.id);

    let covers = await db.getAllCoversbyBookId(bookInfo.id);
    let coverIds = covers.map(cover => "" + cover.id);

    console.log("Info received: ", bookInfo);

    res.render("appliedFilters", {
        bookNames:bookNames,
        currentUrl:'/books',
        genresToBeSelected:genresToBeSelected,
        bookInfo:bookInfo
    });
};

exports.getAllCovers = async (req,res) => {
    let covers = await db.getAllCovers();

    //console.log("ALL COVERS: ", covers);
    
    let allCovers = covers.map(cover => cover.picture_url);

    res.render("appliedFilters", 
        {
        allCovers:allCovers
    });

};

exports.postAddCover = async (req,res) => {
    let pictureUrl = req.body.pictureUrl;
    let description = req.body.description;
    let bookId = req.body.bookId;

    console.log("Picture and descr", pictureUrl, bookId, description);
    await db.addCover(pictureUrl, bookId, description);
    res.redirect(req.path);

};





















exports.getAuthors = async (req, res) => {
    let authorsDbRows = await db.getAllAuthors();
    let authorsNames = [];
    authorsDbRows.map(authorRow => authorsNames.push(authorRow.name));

    let currentUrl = "/author";
    //console.log("Genres are: ", genreNames);

    res.render("appliedFilters", 
        {
        categories:["Genre", "Author", "Title"],
        authors:authorsNames,
        currentUrl:currentUrl
    });
};

exports.getTitlesByAuthor = async (req, res) => {
    const { authorName } = req.params;
    console.log("ASKED FOR THE FOLLOWING author: ", authorName);

    let currentUrl = "/author/" + authorName;

    let authorsDbRows = await db.getAllAuthors();
    let authorsNames = [];
    authorsDbRows.map(authorRow => authorsNames.push(authorRow.name));

    let titlesDbRows = await db.getTitlesByAuthorName(authorName);
    //console.log("GOT THE TITLES:", titlesDbRows);

    let titles = [];
    titlesDbRows.map(titleRow => titles.push({name:titleRow.name, id:titleRow.id }));
    console.log("GOT THE TITLES:", titles);

    res.render("appliedFilters", 
        {authors:authorsNames, 
        titles:titles,
        categories:["Genre", "Author", "Title"],
        authorName:authorName,
        currentUrl:currentUrl
    });
};

exports.getAllTitles = async (req, res) => {
    let titlesDbRows = await db.getAllTitles();
    let titles = [];

    let currentUrl = "/title";

    titlesDbRows.map(titleRow => titles.push({name:titleRow.name, id:titleRow.id }));

    res.render("appliedFilters", 
        {
        titles:titles,
        categories:["Genre", "Author", "Title"],
        currentUrl:currentUrl
    });
};

exports.getTitleInfoById = async (req, res) => {
    const { type, typeName, id } = req.params;

    let currentUrl = "/" + type + "/" + typeName + "/" + id;

    console.log("ASKED FOR THE FOLLOWING info: ", type == "author", typeName, id);

    if (type !="author" && type !="genre"){
        return;
    }
        
    // author, nietsshe, 21

    let typeDbRows= '';
    if (type == 'author')
        typeDbRows = await db.getAllAuthors();
    else
        typeDbRows = await db.getAllGenres();

    let typeNames = [];
    typeDbRows.map(typeRow => typeNames.push(typeRow.name));

    let titlesDbRows = [];
    if (type == 'author')
        titlesDbRows = await db.getTitlesByAuthorName(typeName);
    else
        titlesDbRows = await db.getTitlesByGenreName(typeName);

    let titles = [];
    titlesDbRows.map(titleRow => titles.push({name:titleRow.name, id:titleRow.id }));
    console.log("GOT THE TITLES:", titles);

    let typesKey = type + 's';


    let titleInfoRows = await db.getTitleInfoById(id);
    


    let viewInformation = {[typesKey]:typeNames, 
        titles:titles,
        categories:["Genre", "Author", "Title"],
        titleInfo:{name: titleInfoRows[0].name, photoUrl:titleInfoRows[0].photourl},
        currentUrl:currentUrl
    };

    

    if (type == 'author')
        viewInformation["authorName"] = typeName;
    else 
        viewInformation["genreName"] = typeName;

    console.log(viewInformation);

    res.render("appliedFilters", 
       viewInformation);
};

exports.getTitleInfo = async (req, res) => {
    const { id } = req.params;
    let titleInfoRows = await db.getTitleInfoById(id);

    let currentUrl = "/title";

    res.render("appliedFilters", {categories:["Genre", "Author", "Title"],
         titleInfo:{name: titleInfoRows[0].name, photoUrl:titleInfoRows[0].photourl},
        currentUrl:currentUrl
        });
};

exports.postNewAuthor = async (req, res) => {

    await db.createNewAuthor(name);

};
