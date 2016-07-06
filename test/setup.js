// Root-level hooks that run before Mocha tests. See: http://mochajs.org/#hooks

const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations' };

// Migrates all tables and inserts test data for tests to use.
before('migrating test database', function(done) {
  return knex.migrate.latest(config)
    .then(() => {
      return knex('users').insert({
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        barcode_hash: 'hash',
        house: 'Green',
        member_status: 'Member',
      });
    })
    .then(() => done());
});

// Rolls back database after all tests to avoid previous test suite runs
// affecting the behavior of next test runs.
after('rolling back test database', function(done) {
  knex.migrate.rollback(config)
    .then(() => done());
});
