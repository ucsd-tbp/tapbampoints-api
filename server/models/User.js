/** @file Defines User model. */

require('./Event');
const db = require('../database');

const User = db.model('User', {
  tableName: 'users',
  hidden: ['id', 'password'],

  virtuals: {
    /**
     * Users can be created just via a barcode, so some users don't have an
     * email or password. Members can optionally create an account instead of
     * looking up data via a barcode, which 'registers' them.
     *
     * @return {Boolean} whether the user has registered an email and password
     */
    is_registered() {
      return this.get('email') && this.get('password');
    },
  },

  /**
   * Creates many-to-many relation with events through attendance_records as an
   * intermediary table.
   *
   * @return {Collection<Event>} Events associated with this User.
   */
  events() {
    return this.belongsToMany('Event', 'attendance_records');
  },
});

module.exports = User;
