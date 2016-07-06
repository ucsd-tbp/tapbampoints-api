exports.seed = (knex, Promise) =>
  knex('attendance_records').del().then(() =>
    Promise.all([
      knex('attendance_records').insert({ user_id: 1, event_id: 1, points_earned: 2 }),
      knex('attendance_records').insert({ user_id: 1, event_id: 2, points_earned: 1 }),
      knex('attendance_records').insert({ user_id: 2, event_id: 1, points_earned: 4 }),
      knex('attendance_records').insert({ user_id: 3, event_id: 1 }),
    ])
  );
