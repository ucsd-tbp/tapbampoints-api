const faker = require('faker');

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  // Creates array of insert statements for fake user data.
  for (let i = 1; i <= 10; i++) {
    const query = knex('users').insert({
      id: i,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      barcode_hash: faker.random.uuid(),
      house: faker.helpers.randomize(['Red', 'Green', 'Blue']),
      member_status: faker.helpers.randomize(['Initiate', 'Member', 'Officer']),
    });

    seedQueries.push(query);
  }

  // Drops user database before adding fake data.
  return knex('users').del().then(() => Promise.all(seedQueries));
};
