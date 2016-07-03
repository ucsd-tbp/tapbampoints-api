const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig);
const bookshelf = require('bookshelf');

// Uses Knex instance (database connection) to initialize Bookshelf ORM.
const db = bookshelf(knex);
db.plugin('registry');

// Exports db for creating Bookshelf models and Knex for migrations.
module.exports = db;
