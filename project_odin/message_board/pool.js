const { Pool } = require("pg");
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  host: env.HOST, // or wherever the db is hosted
  user: env.USER,
  database: env.DATABASE,
  password:env.PASSWORD,
  port: 5432 // The default port
});
