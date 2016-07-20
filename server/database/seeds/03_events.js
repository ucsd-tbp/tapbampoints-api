const faker = require('faker');

exports.seed = (knex, Promise) => {
  const seedQueries = [];

  // Creates array of insert statements for fake event data.
  for (let i = 1; i <= 10; i++) {
    const query = knex('events').insert({
      id: i,
      name: faker.lorem.words(),
      description: faker.lorem.lines(),
      points: faker.random.number({ min: 1, max: 6 }),
      officer_id: 1,
      type_id: faker.random.number({ min: 1, max: 4 }),
    });

    seedQueries.push(query);
  }

  // Drops event database before adding fake data.
  return knex('events').del().then(() => Promise.all(seedQueries));
};
