exports.seed = (knex, Promise) =>
  knex('roles').del().then(() =>
    Promise.all([
      knex('roles').insert({
        id: 1,
        name: 'initiate',
        display_name: 'Initiate',
        description: 'Prospective members in the process of initiation.',
      }),

      knex('roles').insert({
        id: 2,
        name: 'pending',
        display_name: 'Pending Member',
        description: 'In the process of being approved to be a member.',
      }),

      knex('roles').insert({
        id: 3,
        name: 'inactive',
        display_name: 'Inactive Member',
        description: 'Inactive member.',
      }),

      knex('roles').insert({
        id: 4,
        name: 'member',
        display_name: 'Member',
        description: 'Active member.',
      }),

      knex('roles').insert({
        id: 5,
        name: 'officer',
        display_name: 'Officer',
        description: 'A current officer on the Tau Beta Pi officer board.',
      }),

      knex('roles').insert({
        id: 6,
        name: 'admin',
        display_name: 'Administrator',
        description: 'Administrator in charge of handling the web application.',
      }),
    ])
  );
