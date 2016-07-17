/** @file Defines User model. */

// TODO Refactor Promises to use Bluebird and update JSDocs.

const bcrypt = require('bcrypt');
const debug = require('debug')('tbp:user-model');

require('./Event');
const db = require('../database');

const User = db.model('User', {
  tableName: 'users',

  // Attributes that aren't serialized when converting a User to JSON.
  hidden: ['id', 'password', 'barcode', 'is_admin'],

  // Attributes that are not mass-assignable.
  guarded: ['id', 'is_admin'],

  outputVirtuals: false,
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

  /** Registers event listeners. */
  initialize() {
    this.on('creating', this.hashPassword);
  },

  /**
   * Creates many-to-many relation with events through attendance_records as an
   * intermediary table.
   *
   * @return {Collection<Event>} events associated with this user
   */
  events() {
    return this.belongsToMany('Event', 'attendance_records');
  },

  /**
   * Event listener that hashes a user's password when a user is created.
   *
   * @param {Model} contains attributes that were sent in POST request
   * @return {Promise} resolves to the hash computed from the password
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
   * credentials = { key: 'barcode', search: barcodeValue, pass: undefined }
   *
   * Logging in with an email and password combination:
   * credentials = { key: 'email', search: emailValue, pass: passwordValue }
   *
   * @param  {Object} credentials an object containing properties key, search, and pass.
   * @return {Promise<User>} resolves to newly logged in user if login was
   *                         successful.
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
