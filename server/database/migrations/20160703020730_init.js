const Houses = require('../../modules/constants').Houses;

/** @file Initial migration */

exports.up = knex =>
  // Specifies user roles.
  knex.schema.createTable('roles', table => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.string('display_name').defaultTo('');
    table.string('description').defaultTo('');
  })

  // Users table, including house and member status.
  .createTable('users', table => {
    table.increments('id').primary();

    table.string('email').unique();

    // Password or pid can be null if a user hasn't been verified via email.
    table.string('password');
    table.string('pid').unique();

    table.string('first_name').defaultTo('').notNullable();
    table.string('last_name').defaultTo('').notNullable();
    table.enu('house', [Houses.RED, Houses.GREEN, Houses.BLUE, Houses.NONE])
      .defaultTo(Houses.NONE).notNullable();

    table.boolean('valid').defaultTo(false).notNullable();
    table.string('email_verification_code');

    // Can be null if a user hasn't been verified via email yet.
    table.integer('role_id').unsigned().references('id')
      .inTable('roles');
  })

  // Reference table for event types (academic, social, community, wildcard).
  // Lets events be associated with a type, used in place of an enum to hold
  // additional info.
  .createTable('event_types', table => {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.string('display_name').defaultTo('');
    table.text('description').defaultTo('');
  })

  // Events table.
  .createTable('events', table => {
    table.increments('id').primary();
    table.string('summary').defaultTo('').notNullable();
    table.text('description').defaultTo('');
    table.integer('points').defaultTo(0).notNullable();
    table.string('location').notNullable().defaultTo('');
    table.dateTime('start').notNullable();
    table.dateTime('end').notNullable();
    table.timestamps(false, true);

    table.integer('type_id').unsigned().references('id')
          .inTable('event_types')
          .notNullable();

    table.integer('officer_id').unsigned().references('id')
          .inTable('users');
  })

  // Pivot table for many-to-many relation between users and events.
  .createTable('attendance_records', table => {
    table.increments('id').primary();
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
  })

  .createTable('announcements', table => {
    table.increments('id').primary();
    table.string('summary').notNullable();
    table.text('description').defaultTo('').notNullable();
    table.timestamps(false, true);
  });

exports.down = knex =>
  knex.schema.dropTable('attendance_records')
              .dropTable('events')
              .dropTable('event_types')
              .dropTable('users')
              .dropTable('roles')
              .dropTable('announcements');
