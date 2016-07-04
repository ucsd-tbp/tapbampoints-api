const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations', transaction: false };

// Root-level hooks that run before Mocha tests. See: http://mochajs.org/#hooks
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

after('rolling back test database', function(done) {
  knex.migrate.rollback(config)
    .then(() => done());
});
