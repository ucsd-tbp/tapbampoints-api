// Loads environment variables when using Knex CLI.
require('dotenv').config({ path: `${__dirname}/../../.env` });

// A knexfile is typically for specifying config settings for a knex instance.
const knexConfig = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: 'utf8',
  },
};

// Exports knex configuration for initialization in db.js.
module.exports = knexConfig;
