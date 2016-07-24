require('./User');
require('./Event');
const db = require('../database');

const AttendanceRecord = db.model('AttendanceRecord', {
  tableName: 'events',
  fillable: ['user_id', 'event_id', 'points_earned'],

  event() {
    return this.belongsTo('Event');
  },

  user() {
    return this.belongsTo('User');
  },
});

module.exports = AttendanceRecord;
