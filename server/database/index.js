const bookshelf = require('bookshelf');

// Uses database connection info to create a Knex instance.
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig);

// Uses Knex instance (database connection) to initialize Bookshelf ORM.
const db = bookshelf(knex);

// Registers Bookshelf registry plugin to avoid circular dependencies when
// defining relationships between models.
db.plugin('registry');

// Exports db for creating Bookshelf models.
module.exports = db;
