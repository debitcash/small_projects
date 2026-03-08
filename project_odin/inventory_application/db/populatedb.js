const { Client } = require("pg");
const dotenv = require("dotenv");

const env = dotenv.config()
const dbConnectionString = process.env.DB_CONNECTION_STRING;
//console.log("CONECTION STRING IS: ", dbConnectionString);

const SQL = `
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 20 )
);

INSERT INTO genres (name) 
VALUES
  ('Fantasy'),
  ('Romance'),
  ('Mystery'),
  ('Science Fiction');

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 20 ),
  author VARCHAR ( 20 )
);

INSERT INTO books (title, author) 
VALUES(
  'Warhammer 4000',
  'Mahatma Ghandi'
  );

CREATE TABLE IF NOT EXISTS covers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  picture_url TEXT,
  description TEXT,
  book_id INTEGER
  );

  INSERT INTO covers (picture_url, description, book_id)
VALUES
  ('https://www.warhammer.com/app/resources/catalog/product/920x950/60040181428_BLDeathRider2026.jpg?fm=webp&w=892&h=920',
  'English Language Edition with orc illustration',
  1);

  CREATE TABLE IF NOT EXISTS books_genres (
    book_id INTEGER,
    genre_id INTEGER
  );

  INSERT INTO books_genres (book_id, genre_id)
  VALUES (1, 4);  
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    //connectionString: `postgresql://${env.USER}@${env.URI}}/top_users`,
    connectionString: dbConnectionString,
    //connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.URI}/${process.env.DATABASE}`,
  
  });
  
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();