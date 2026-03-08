const { Pool } = require("pg");
const dotenv = require('dotenv');

const env = dotenv.config();
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  connectionString: dbConnectionString
});
