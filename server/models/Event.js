/** @file Defines Event model. */

require('./User');
require('./AttendanceRecord');
const db = require('../database');

const Event = db.model('Event', {
  tableName: 'events',
  hidden: ['type_id', 'officer_id'],
  fillable: [
    'summary', 'description', 'location', 'points', 'start', 'end',
  ],

  relationships: {
    /** Officer chairing this event. */
    officer() {
      return this.belongsTo('User', 'officer_id');
    },

    /** Attendees confirmed to be at event. */
    attendees() {
      return this.belongsToMany('User', 'attendance_records');
    },

    /** Type of this event, i.e. 'academic', 'social', 'service'. */
    type() {
      return this.belongsTo('EventType', 'type_id');
    },
  },
});

module.exports = Event;
