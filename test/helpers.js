/** @file Behavior used often in before and after events in each test. */

const bcrypt = require('bcrypt');
const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations' };


/**
 * Queries to use with migrateWithQueries across test suites.
 * @see helpers.migrateWithQueries
 */
const queries = {
  users: [knex('users').insert({
    id: 1,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@test.com',
    password: bcrypt.hashSync('password', 0),
    barcode: 'barcode1',
  }), knex('users').insert({
    id: 2,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@test.com',
    password: bcrypt.hashSync('admin', 0),
    barcode: 'adminbarcode',
    is_admin: true,
  })],
};

const helpers = {
  /**
   * Migrates and runs database queries in a test suite hook.
   *
   * @example
   * before('migrate with test users', function(done) {
   * 	return helpers.migrateWithQueries(queries.users).then(() => done);
   * });
   *
   * @param  {Array} queriesToRun An array of Knex queries to run.
   * @return {Promise} Resolves when all queries have finished.
   */
  migrateWithQueries(queriesToRun) {
    return knex.migrate.latest(config).then(() => Promise.all(queriesToRun));
  },

  /**
   * Rolls back database in a test suite hook.
   *
   * @example
   * after('rolls back database', helpers.rollback);
   *
   * @param  {Function} done Callback to mark test suite hook as finished.
   * @return {Promise} Resolves when rollback finishes.
   */
  rollback(done) {
    return knex.migrate.rollback(config).then(() => done());
  },
};

module.exports = { helpers, queries };
