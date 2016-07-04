exports.seed = (knex, Promise) =>
  knex('event_types').del().then(() =>
    Promise.all([
      knex('event_types').insert({ id: 1, name: 'Academic', description: 'Academic events.' }),
      knex('event_types').insert({ id: 2, name: 'Social', description: 'Social events.' }),
      knex('event_types').insert({ id: 3,
        name: 'Community Service or Outreach',
        description: 'Community service or outreach events.',
      }),
      knex('event_types').insert({ id: 4, name: 'Wildcard', description: 'Wildcard events.' }),
    ])
  );
