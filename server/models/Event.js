require('./User');
const db = require('../database');

// Defines Event model.
const Event = db.model('Event', {
  tableName: 'events',

  /**
   * Creates many-to-many relationship with users through attendance_records
   * as an intermediary table.
   * @return {Collection} Users associated with this event.
   */
  users() {
    return this.belongsToMany('User', 'attendance_records');
  },
});

// Loads Event model into Bookshelf registry.
module.exports = Event;
