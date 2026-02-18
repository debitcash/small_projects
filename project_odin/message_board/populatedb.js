const { Client } = require("pg");
const dotenv = require("dotenv");
const pool = require("./pool");

const env = dotenv.config().parsed;

const SQL = `
CREATE TABLE IF NOT EXISTS recordstable (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO recordstable (username, message) 
VALUES
  ('Bryan', 'Hello World!'),
  ('Odin', 'Testing message board'),
  ('Damon', 'Another message');
`;

async function main() {
  console.log("Seeding database...");

    

  const client = new Client({
    connectionString: `postgresql://${env.USER}:${env.PASSWORD}@${env.URI}/${env.DATABASE}`,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.end();
  }
}

main();
