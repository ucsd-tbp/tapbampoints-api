/** @file Defines Event model. */

require('./User');
require('./AttendanceRecord');
const db = require('../database');

const Event = db.model('Event', {
  tableName: 'events',
  hidden: ['type_id', 'officer_id'],
  fillable: ['name', 'description', 'points', 'officer_id', 'type_id'],

  relationships: {
    /**
     * Creates one-to-many relation for the relation between an officer and the
     * events they chair.
     *
     * @return {User} Member that chaired this event.
     */
    officer() {
      return this.belongsTo('User', 'officer_id');
    },

    /**
     * Creates many-to-many relation to represent an event and its confirmed
     * attendees.
     *
     * @return {Collection<User>} Users associated with this event.
     */
    attendees() {
      return this.belongsToMany('User', 'attendance_records');
    },

    /**
     * Creates a one-to-many relation to represent the type that this event
     * belongs to.
     *
     * @return {EventType} Event type associated with this event.
     */
    type() {
      return this.belongsTo('EventType', 'type_id');
    },
  },
});

// Loads Event model into Bookshelf registry.
module.exports = Event;
