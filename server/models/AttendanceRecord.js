/** @file Defines AttendanceRecord model via a pivot table. */

require('./User');
require('./Event');
const db = require('../database');

const AttendanceRecord = db.model('AttendanceRecord', {
  tableName: 'attendance_records',

  hidden: ['user_id', 'event_id'],
  fillable: ['points_earned'],
  queryable: ['user_id', 'event_id', 'points_earned'],

  /** Defines a many-to-many relationship between events and users. */
  relationships: {
    event() {
      return this.belongsTo('Event');
    },

    user() {
      return this.belongsTo('User');
    },
  },
});

module.exports = AttendanceRecord;
