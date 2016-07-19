/** @file Behavior used often in before and after events in each test. */

const bcrypt = require('bcrypt');
const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations' };

const helpers = {
  migrateWithTestUser(done) {
    return knex.migrate.latest(config)
      .then(() => {
        const queries = [];

        queries.push(knex('users').insert({
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@test.com',
          password: bcrypt.hashSync('password', 0),
          barcode: 'barcode1',
        }));

        queries.push(knex('users').insert({
          id: 2,
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@test.com',
          password: bcrypt.hashSync('admin', 0),
          barcode: 'adminbarcode',
          is_admin: true,
        }));

        return Promise.all(queries);
      })
      .then(() => done());
  },

  rollback(done) {
    knex.migrate.rollback(config)
      .then(() => done());
  },
};

module.exports = helpers;
