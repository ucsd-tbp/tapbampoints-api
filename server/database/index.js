const bookshelf = require('bookshelf');

const config = require('./knexfile');
const knex = require('knex')(config[process.env.NODE_ENV]);

// Uses Knex instance (database connection) to initialize Bookshelf ORM.
const db = bookshelf(knex);

// Avoids circular dependencies when defining relationships between models.
db.plugin('registry');

// Allows whitelisting/blacklisting of model attributes.
db.plugin('visibility');

module.exports = db;
