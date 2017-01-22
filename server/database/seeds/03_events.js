exports.seed = (knex, Promise) => {
  const seedQueries = [];

  const query = knex('events').insert({
    id: 1,
    summary: 'Green House: TapEx Bonding',
    description: 'Stop by TapEx in PC to grab a drink and mingle!',
    points: 2,
    type_id: 2,
    start: '2017-01-18 14:00:00',
    end: '2017-01-18 16:00:00',
  });

  seedQueries.push(query);

  // Drops event database before adding fake data.
  return knex('events').del().then(() => Promise.all(seedQueries));
};
