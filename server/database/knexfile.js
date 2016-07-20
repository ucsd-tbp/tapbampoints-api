/** @file Defines database connection variables for each environment. */

// Loads environment variables when using Knex CLI.
require('dotenv').config({ path: `${__dirname}/../../.env` });

const config = {
  production: {
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
