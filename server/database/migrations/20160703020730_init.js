/** @file Initial migration */

exports.up = knex =>
  // Users table, including house and member status.
  knex.schema.createTable('users', table => {
    table.increments('id').primary();

    // Can be null if a user authenticates via the barcode.
    table.string('email').unique();
    table.string('password');

    table.string('first_name').defaultTo('').notNullable();
    table.string('last_name').defaultTo('').notNullable();
    table.string('barcode').unique().notNullable();
    table.boolean('is_admin').defaultTo(false).notNullable();
    table.enu('house', ['Red', 'Green', 'Blue', 'None']).defaultTo('None').notNullable();
    table.enu('member_status', ['Initiate', 'Member', 'Officer']).defaultTo('Initiate')
          .notNullable();
  })

  // Reference table for event types (academic, social, community, wildcard).
  // Lets events be associated with a type, used in place of an enum to hold
  // additional info.
  .createTable('event_types', table => {
    table.increments('id').primary();
    table.string('name').defaultTo('').notNullable();
    table.text('description').defaultTo('').notNullable();
  })

  // Events table.
  .createTable('events', table => {
    table.increments('id').primary();
    table.string('name').defaultTo('').notNullable();
    table.text('description').defaultTo('').notNullable();
    table.integer('points').defaultTo(0).notNullable();
    table.string('officer').defaultTo('').notNullable();
    table.timestamps();

    table.integer('type_id').unsigned().references('id')
          .inTable('event_types');
  })

  // Pivot table for many-to-many relation between users and events.
  .createTable('attendance_records', table => {
    table.unique(['user_id', 'event_id']);

    table.integer('user_id').unsigned().references('id')
          .inTable('users')
          .onDelete('CASCADE');
    table.integer('event_id').unsigned().references('id')
          .inTable('events')
          .onDelete('CASCADE');

    table.integer('points_earned').unsigned()
          .defaultTo(0)
          .notNullable();
  });

exports.down = knex =>
  knex.schema.dropTable('attendance_records')
              .dropTable('events')
              .dropTable('event_types')
              .dropTable('users');
