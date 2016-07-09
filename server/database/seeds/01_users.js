const faker = require('faker');
const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  // Creates a user already registered with an email and password.
  seedQueries.push(knex('users').insert({
    id: 1,
    email: faker.internet.email(),
    password: bcrypt.hashSync('password', 0),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    barcode: bcrypt.hashSync('barcode', 0),
    house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
    member_status: faker.helpers.randomize(['Initiate', 'Member', 'Officer']),
  }));

  // Creates users created only via barcodes.
  for (let i = 2; i <= 10; i++) {
    const query = knex('users').insert({
      id: i,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      barcode: bcrypt.hashSync('barcode', 0),
      house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
      member_status: faker.helpers.randomize(['Initiate', 'Member', 'Officer']),
    });

    seedQueries.push(query);
  }

  // Drops user database before adding fake data.
  return knex('users').del().then(() => Promise.all(seedQueries));
};
