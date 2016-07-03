require('./Event');
const db = require('../database');

// Defines User model.
const User = db.model('User', {
  tableName: 'users',

  /**
   * Creates many-to-many relationship with events through attendance_records
   * as an intermediary table.
   * @return {Collection} Events associated with this User.
   */
  events() {
    return this.belongsToMany('Event', 'attendance_records');
  },
});

module.exports = User;
