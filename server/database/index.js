/**
 * @file Configures Knex according to the current environment and initializes
 * the Bookshelf ORM with relevant plugins.
 */

const bookshelf = require('bookshelf');
const debug = require('debug')('tbp:database');

debug('initializing knex and bookshelf instances');

const config = require('./knexfile');
const knex = require('knex')(config[process.env.NODE_ENV]);
const db = bookshelf(knex);

// Avoids circular dependencies when defining relationships between models.
db.plugin('registry');

// Allows whitelisting/blacklisting of model attributes.
db.plugin('visibility');

// Allows defining of virtual properties.
db.plugin('virtuals');

// Provides fillable and guarded properties for mass-assignment protection.
db.plugin('bookshelf-mass-assignment');

// TODO Add a model for attendance records.
module.exports = db;
