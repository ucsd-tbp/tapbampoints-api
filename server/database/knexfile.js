// Loads environment variables when using Knex CLI.
require('dotenv').config({ path: `${__dirname}/../../.env` });

const config = {
  // Uses development database.
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      charset: 'utf8',
    },
    tableName: 'migrations',
  },

  // Uses mock test database for testing.
  test: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.TEST_DB_NAME,
      charset: 'utf8',
    },
    tableName: 'migrations',
  },
};

// Exports knex configuration for initialization in db.js.
module.exports = config;
