const pool = require("./pool");

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function createNewGenre(name) {
  await pool.query("INSERT INTO genres (name) VALUES (($1))", [name]);
}

async function deleteGenreByName(genreName) {
  await pool.query("DELETE FROM genres WHERE name = ($1)", [genreName]);
}

async function updateGenreName(oldName, newName){
    await pool.query("UPDATE genres SET name = ($1) WHERE name = ($2)", [newName, oldName]);
};


async function getTitlesByGenreName(genreName) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE id IN 
    (SELECT book_id FROM books_genres WHERE genre_id IN
    (SELECT id FROM genres WHERE name ILIKE($1))
    )`, [genreName]);
  return rows;
}

async function addBookToGenre(genreName, title, author) {
  await pool.query(`INSERT INTO books (title, author) VALUES (($1), ($2))`, [title, author]);
  await pool.query(`INSERT INTO books_genres (book_id, genre_id) 
    SELECT b.id, g.id
    FROM books b
    JOIN genres g ON g.name ILIKE $2
    WHERE b.title ILIKE $1;`, [title, genreName]);
}

async function getAuthorByTitle(title) {
  const { rows } = await pool.query(`SELECT author, id FROM books WHERE title ILIKE $1 LIMIT 1`, [title]);
  return rows;
}

async function updateBookRecord(updatedTitle, updatedAuthor, bookId){
    await pool.query("UPDATE books SET title = $1, author = $2 WHERE id = $3", [updatedTitle, updatedAuthor, bookId]);
}

async function deleteBookByName(bookTitle) {
    await pool.query("DELETE FROM books WHERE title = ($1)", [bookTitle]);
}

async function getBookInfoByTitle(title) {
  const { rows } = await pool.query(`SELECT * FROM books WHERE title ILIKE $1 LIMIT 1`, [title]);
  return rows;
}

async function getAllGenresInfo() {
    const { rows } = await pool.query(`SELECT * FROM genres`);
  return rows;
}

async function linkBooksGenres(genres, bookId) {
  
  genres.forEach(async element => {
      await pool.query(`INSERT INTO books_genres (book_id, genre_id) VALUES (($1), ($2))`, [bookId, element]);
  });
  
}

async function getCorrespondingGenres(bookId) {
  const { rows } = await pool.query(`SELECT * FROM books_genres WHERE book_id = $1`, [bookId]);
  return rows;
}

async function getCorrespondingGenreNames(bookId) {
    const { rows } = await pool.query(`SELECT * FROM genres WHERE id IN
      (SELECT genre_id from books_genres WHERE book_id = $1) `, [bookId]);
  return rows;
}

async function getAllCoversbyBookId(bookId) {
    const { rows } = await pool.query(`SELECT * FROM covers WHERE book_id = $1`, [bookId]);
  return rows;
}

async function addCover(url, bookIdentifier, description) {
  await pool.query(`INSERT INTO covers (picture_url, description, book_id)
    VALUES ($1, $2, $3);`, [url, description, bookIdentifier]);
}

async function addCoverByTitle(url, title, description) {
  await pool.query(`
    INSERT INTO covers (picture_url, description, book_id)
    SELECT $2, $3, id 
    FROM books
    WHERE title ILIKE ($1);
    `, [title, url, description]);
}

async function getImageUrlByCoverId(coverId) {
      const { rows } = await pool.query(`SELECT picture_url FROM covers WHERE id = $1`, [coverId]);
  return rows;
}

async function getBookInfoById(id) {
  const { rows } = await pool.query("SELECT * FROM books WHERE id=($1)", [id]);
  return rows;
}

async function deleteCoverbyId(id) {
  await pool.query("DELETE FROM covers WHERE id = ($1)", [id]);
}

async function getCoverInfoById(id) {
  const { rows } = await pool.query("SELECT * FROM covers WHERE id=($1)", [id]);
  return rows;
}

async function updateCoverRecord(coverId, url, bookId) {
  const { rows } = await pool.query("UPDATE covers SET picture_url = $1, book_id = $2 WHERE id = $3", [url, bookId, coverId]);
  return rows;
}

async function getAllBooks() {
  const { rows } = await pool.query("SELECT * FROM books;");
  return rows;
}

async function getAllCovers() {
  const { rows } = await pool.query("SELECT * FROM covers;");
  return rows;
}

async function addBook(title, author, linkedGenres) {
  await pool.query(`INSERT INTO books (title, author) VALUES (($1), ($2))`, [title, author]);

  for (let i = 0; i < linkedGenres.length; i++){
    await pool.query(`
    INSERT INTO books_genres (book_id, genre_id)
    SELECT id, $1 
    FROM books
    WHERE title ILIKE ($2);`, [linkedGenres[i], title]);

  };
}
















async function getAllAuthors() {
  const { rows } = await pool.query("SELECT * FROM authors");
  return rows;
}

async function getTitlesByAuthorName(authorName) {
  const { rows } = await pool.query("SELECT * FROM titles WHERE authorid IN (SELECT id FROM authors WHERE name ILIKE ($1))", [authorName]);
  return rows;
}

async function getAllTitles() {
  const { rows } = await pool.query("SELECT * FROM titles");
  return rows;
}



async function createNewAuthor(name) {
  const { rows } = await pool.query("INSERT INTO authors (name) VALUES ($1)", [name]);
  return rows;
}

async function deleteAllUsernames() {
  await pool.query("DELETE FROM usernames");
}

async function findByString(searchStr) {
    const { rows } =  await pool.query("SELECT * FROM usernames WHERE username ILIKE $1", [`%${searchStr}%`]);
    return rows;
}

module.exports = {
  getAllGenres,
  getTitlesByGenreName,
  getAllAuthors,
  getTitlesByAuthorName,
  getAllTitles,
  createNewGenre,
  deleteGenreByName,
  updateGenreName,
  addBookToGenre,
  getAuthorByTitle,
  updateBookRecord,
  deleteBookByName,
  getBookInfoByTitle,
  getAllGenresInfo,
  linkBooksGenres,
  getCorrespondingGenres,
  getCorrespondingGenreNames,
  getAllCoversbyBookId,
  addCover,
  addCoverByTitle,
  getBookInfoById,
  getImageUrlByCoverId,
  deleteCoverbyId,
  getCoverInfoById,
  updateCoverRecord,
  getAllBooks,
  addBook,
  getAllCovers
  /*,
  insertUsername,
  deleteAllUsernames,
  findByString*/
};