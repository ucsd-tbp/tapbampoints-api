/** @file Behavior used often in before and after events in each test. */

const bcrypt = require('bcrypt');
const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations' };

const helpers = {
  migrateWithTestUser(done) {
    return knex.migrate.latest(config)
      .then(() => {
        return knex('users').insert({
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@test.com',
          password: bcrypt.hashSync('password', 0),
          barcode: bcrypt.hashSync('barcode', 0),
        });
      })
      .then(() => done());
  },

  rollback(done) {
    knex.migrate.rollback(config)
      .then(() => done());
  },
}

module.exports = helpers;