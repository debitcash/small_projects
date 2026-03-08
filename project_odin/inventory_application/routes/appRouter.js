const { Router } = require("express");
const appRouter = Router();
const appController = require("../controllers/appController");

appRouter.get("/", appController.getHomepage);

appRouter.get("/genres", appController.getGenres);
appRouter.post("/genres", appController.postGenres);

// change to the genre
//appRouter.post("/genres/:genreName", appController.postGenreName);

// show the input fields for new name
appRouter.get("/genres/:genreName/update", appController.getUpdateGenre);
// apply changes to a genre, including adding a book
appRouter.post("/genres/:genreName", appController.postUpdateGenre);

appRouter.get("/genres/:genreName", appController.getTitlesByGenre);

appRouter.get("/genres/:genreName/:bookTitle/update", appController.getUpdateBook);

appRouter.post("/books/:bookIdentifier", appController.postUpdateBook);
appRouter.post("/genres/:genreName/:bookIdentifier", appController.postUpdateBook);

appRouter.get("/genres/:genreName/:bookTitle", appController.getBookDetails);

// get the cover view
appRouter.get("/genres/:genreName/:bookId/:coverId", appController.getCoverInGenres);

appRouter.post("/genres/:genreName/:bookId/:coverId", appController.postUpdateCover);
appRouter.get("/genres/:genreName/:bookId/:coverId/update", appController.getUpdateCover);

appRouter.post("/covers/:coverId", appController.postUpdateCover);


appRouter.get("/books", appController.getAllBooks);
appRouter.post("/books", appController.postAllBooks);
appRouter.get("/books/:bookTitle/update", appController.getUpdateBook);

appRouter.get("/books/:bookId", appController.getBook);

appRouter.get("/covers", appController.getAllCovers);
appRouter.post("/covers", appController.postAddCover);

appRouter.post("/auth", appController.authAttempt);



/*
appRouter.get("/author", appController.getAuthors);
appRouter.get("/author/:authorName", appController.getTitlesByAuthor);

appRouter.get("/:type/:typeName/:id", appController.getTitleInfoById);

appRouter.get("/title", appController.getAllTitles);
appRouter.get("/title/:id", appController.getTitleInfo);
*/


module.exports = appRouter;
