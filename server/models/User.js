/** @file Defines User model. */

const bcrypt = require('bcrypt');
const debug = require('debug')('tbp:user-model');

require('./Event');
const db = require('../database');

const User = db.model('User', {
  tableName: 'users',

  // Attributes that aren't serialized when converting a User to JSON.
  hidden: ['password', 'barcode', 'is_admin'],

  // Attributes that are not mass-assignable.
  guarded: ['id', 'is_admin'],

  // Attributes that can be used to search, filter, or sort collection results.
  queryable: ['email', 'first_name', 'last_name', 'house', 'member_status'],

  // Whether to include virual properties in JSON serialization (e.g.
  // is_registered).
  outputVirtuals: false,

  /** Registers event listeners. */
  initialize() {
    // TODO Write unit tests for hashing password on update.
    this.on('saving', this.hashPassword);
  },

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

  relationships: {
    /**
     * Creates one-to-many relation to represent the relation between this user
     * and the events they have chaired.
     *
     * @return {Collection<Event>} Events that this user chaired.
     */
    chaired_events() {
      return this.hasMany('Event', 'officer_id');
    },

    /**
     * Creates many-to-many relation with events to represent the events that
     * this user has attended.
     *
     * @return {Collection<Event>} Events that this user attended.
     */
    attended_events() {
      return this.belongsToMany('Event', 'attendance_records');
    },
  },

  /**
   * Event listener that hashes the  password when a user is created.
   *
   * @return {Promise<string>} Resolves to hashed password.
   */
  hashPassword() {
    // Avoids hashing the password if the barcode is used to register.
    if (!this.attributes.password) return;

    return new Promise((resolve, reject) => {
      bcrypt.hash(this.attributes.password, 10, (err, hash) => {
        if (err) reject(err);

        debug(`hashed password: ${hash}`);
        this.set('password', hash);

        resolve(hash);
      });
    });
  },

  /**
   * Logs in a user by searching for the user given a set of credentials. Users
   * can login with an email and password, or with just the barcode only if
   * their email and password have not yet been set. Both these options
   * corresponds to a credentials set.
   *
   * Logging in with just a barcode:
   * `credentials = { key: 'barcode', search: barcodeValue, pass: undefined }`
   *
   * Logging in with an email and password combination:
   * `credentials = { key: 'email', search: emailValue, pass: passwordValue }`
   *
   * @param {Object} credentials An object containing properties key, search,
   * and pass.
   * @param {string} credentials.key Name of field to search for the user
   * with, either `'email'` or `'barcode'`.
   * @param {string} credentials.search Value of field used to search.
   * @param {string} pass Value of field to authenticate user with. Is the
   * password when an email and password combination is passed in. Otherwise,
   * both `credentials.search` and `credentials.pass` is the barcode value.
   * @return {Promise<User>} resolves to newly logged in user if login was
   * successful.
   */
  login(credentials) {
    return User.where(credentials.key, credentials.search)
      .fetch({ require: true })
      .then(user =>
        new Promise((resolve, reject) => {
          if (credentials.key === 'barcode') {
            // Login fails if users with non-empty email and password fields
            // try to login with just their barcode.
            if (user.is_registered) {
              return reject(
                new Error('Login via barcode is disabled with a registered email and password.')
              );
            }

            // Logging in with just the barcode is valid provided the user has
            // not registered an email and password.
            return resolve(user);
          }

          // If not logging in by barcode, then the user is logging in with
          // both email and password, so checks for password correctness.
          bcrypt.compare(credentials.pass, user.get('password'), (err, result) => {
            if (err) return reject(err);
            if (!result) return reject(new Error('The email and password entered don\'t match.'));

            resolve(user);
          });
        })
      );
  },
});

module.exports = User;
