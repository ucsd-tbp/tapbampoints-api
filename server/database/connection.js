// Connects to database and prepares a knex instance.
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: 'utf8',
  },
});

// Initializes Bookshelf ORM library.
const bookshelf = require('bookshelf')(knex);

module.exports = { knex, bookshelf };
