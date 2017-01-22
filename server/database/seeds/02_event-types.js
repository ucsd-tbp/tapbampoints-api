exports.seed = (knex, Promise) =>
  knex('event_types').del().then(() =>
    Promise.all([
      knex('event_types').insert({ id: 1, summary: 'Academic', description: 'Academic events.' }),
      knex('event_types').insert({ id: 2, summary: 'Social', description: 'Social events.' }),
      knex('event_types').insert({ id: 3,
        summary: 'Community Service or Outreach',
        description: 'Community service or outreach events.',
      }),
      knex('event_types').insert({ id: 4, summary: 'Wildcard', description: 'Wildcard events.' }),
    ])
  );
