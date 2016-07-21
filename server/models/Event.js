/** @file Defines Event model. */

require('./User');
const db = require('../database');

const Event = db.model('Event', {
  tableName: 'events',

  hidden: ['id'],

  fillable: ['name', 'description', 'points', 'officer_id', 'type_id'],

  /**
   * Creates many-to-many relation with users through attendance_records as an
   * intermediary table.
   *
   * @return {Collection<User>} Users associated with this event.
   */
  attendees() {
    return this.belongsToMany('User', 'attendance_records');
  },

  /**
   * Creates many-to-one relation between events and event types.
   *
   * @return {EventType} Event type associated with this event.
   */
  type() {
    return this.belongsTo('EventType');
  },
});

// Loads Event model into Bookshelf registry.
module.exports = Event;
