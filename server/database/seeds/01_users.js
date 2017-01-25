const faker = require('faker');
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  // Inserts an admin user.
  seedQueries.push(knex('users').insert({
    id: 1,
    email: 'officer@tbp.ucsd.edu',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Obi-Wan',
    last_name: 'Kenobi',
    barcode: faker.random.uuid(),
    house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
    member_status: 'Officer',
    is_admin: true,
  }));

  // Inserts a non-admin user.
  seedQueries.push(knex('users').insert({
    id: 2,
    email: 'member@tbp.ucsd.edu',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Luke',
    last_name: 'Skywalker',
    barcode: faker.random.uuid(),
    house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
    member_status: 'Member',
    is_admin: false,
  }));

  // Drops user database before adding fake data.
  return knex('users').del().then(() => Promise.all(seedQueries));
};
