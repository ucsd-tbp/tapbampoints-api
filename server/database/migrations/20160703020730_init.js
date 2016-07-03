exports.up = (knex, Promise) =>
  // Users table, including house and member status.
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('first_name').defaultTo('').notNullable();
    table.string('last_name').defaultTo('').notNullable();
    table.boolean('valid').defaultTo(true).notNullable();
    table.string('barcode_hash').defaultTo('').notNullable();
    table.enu('house', ['Red', 'Green', 'Blue']).notNullable();
    table.enu('member_status', ['Initiate', 'Member', 'Officer']).notNullable();
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
    table.boolean('valid').defaultTo(true).notNullable();
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
    table.increments('id').primary();
    table.unique(['user_id', 'event_id']);
    table.boolean('valid').defaultTo(true).notNullable();

    table.integer('user_id').unsigned().references('id')
          .inTable('users');
    table.integer('event_id').unsigned().references('id')
          .inTable('events');
  });

exports.down = (knex, Promise) =>
  knex.schema.dropTable('attendance_records')
              .dropTable('events')
              .dropTable('event_types')
              .dropTable('users');
