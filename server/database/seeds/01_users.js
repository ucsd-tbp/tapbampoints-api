const faker = require('faker');
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  seedQueries.push(knex('users').insert({
    id: 1,
    email: 'admin@tbp.org',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Admin',
    last_name: 'User',
    barcode: faker.random.uuid(),
    house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
    member_status: 'Officer',
    is_admin: true,
  }));

  // Drops user database before adding fake data.
  return knex('users').del().then(() => Promise.all(seedQueries));
};
