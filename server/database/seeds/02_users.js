const faker = require('faker');
const bcrypt = require('bcrypt');

const Houses = require('../../modules/constants').Houses;

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  // Inserts an admin user.
  seedQueries.push(knex('users').insert({
    id: 1,
    email: 'officer@tbp.ucsd.edu',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Obi-Wan',
    last_name: 'Kenobi',
    pid: 'A11111111',
    house: faker.helpers.randomize([Houses.RED, Houses.GREEN, Houses.BLUE]),
    role_id: 5,
    valid: 1,
  }));

  // Inserts a non-admin verified user.
  seedQueries.push(knex('users').insert({
    id: 2,
    email: 'member@tbp.ucsd.edu',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Luke',
    last_name: 'Skywalker',
    pid: 'A22222222',
    house: faker.helpers.randomize([Houses.RED, Houses.GREEN, Houses.BLUE, Houses.NONE]),
    role_id: 4,
    valid: 1,
  }));

    // Inserts a non-verified user.
  seedQueries.push(knex('users').insert({
    id: 3,
    email: 'invalid@tbp.ucsd.edu',
    password: bcrypt.hashSync('password', 0),
    first_name: 'Rey',
    last_name: 'Skywalker',
    pid: 'A33333333',
    house: faker.helpers.randomize([Houses.RED, Houses.GREEN, Houses.BLUE, Houses.NONE]),
    role_id: 4,
    valid: 0,
  }));

  // Drops user database before adding fake data.
  return knex('users').del().then(() => Promise.all(seedQueries));
};
