exports.seed = (knex, Promise) =>
  knex('attendance_records').del().then(() =>
    Promise.all([
      knex('attendance_records').insert({ id: 1, user_id: 1, event_id: 1 }),
      knex('attendance_records').insert({ id: 2, user_id: 1, event_id: 2 }),
      knex('attendance_records').insert({ id: 3, user_id: 2, event_id: 1 }),
      knex('attendance_records').insert({ id: 4, user_id: 3, event_id: 1 }),
    ])
  );
