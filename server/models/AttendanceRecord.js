require('./User');
require('./Event');
const db = require('../database');

// Defines AttendanceRecord model, represents an entry in pivot table between
// users and events.
const AttendanceRecord = db.model('AttendanceRecord', {
  tableName: 'events',

  /**
   * Defines event that this attendance record is for.
   * @return {Event} Event associated with this attendance record.
   */
  event() {
    return this.belongsTo('Event');
  },

  /**
   * Defines user that this attendance record involves.
   * @return {User} User associated with this attendance record.
   */
  user() {
    return this.belongsTo('User');
  },
});

module.exports = AttendanceRecord;
