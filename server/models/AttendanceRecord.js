require('./User');
require('./Event');
const db = require('../database');

const AttendanceRecord = db.model('AttendanceRecord', {
  tableName: 'events',
  hidden: ['user_id', 'event_id'],
  fillable: ['points_earned'],

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
