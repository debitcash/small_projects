const { Client } = require("pg");

const dbConnectionString = "postgresql://macbook@localhost:5432/members_only";
//console.log("CONECTION STRING IS: ", dbConnectionString);

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first TEXT ,
  last TEXT ,
  email TEXT ,
  password TEXT ,
  membership_type TEXT,
  admin TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  user_id INTEGER ,
  title TEXT,
  time TEXT,
  text TEXT
  );
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: dbConnectionString,
  });
  
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();