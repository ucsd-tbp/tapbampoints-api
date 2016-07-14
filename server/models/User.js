/** @file Defines User model. */

const bcrypt = require('bcrypt');
const debug = require('debug')('tbp:user-model');

require('./Event');
const db = require('../database');

const User = db.model('User', {
  tableName: 'users',
  hidden: ['id', 'password', 'barcode', 'is_admin'],
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
   * Logs a user in given a search field for finding the desired user to login
   * as and an authentication field to use as a password. Users can login with
   * just the barcode as both the search and auth field, or an email as the
   * search field and their password as the auth field.
   *
   * @param  {String} search used to find the desired user to login as, either
   *                         email or barcode
   * @param {String} auth used as a password, either the password or barcode
   * @return {Promise} Resolves to the logged in user if pass values matched.
   */
  login(search, pass) {
    debug(`logging in with ${search.email} and ${pass}`);

    return new Promise((resolve, reject) => {
      User.where(search)
        .fetch({ require: true })
        .then(user => {
          debug(`plaintext [${pass}] hashed [${user.get('password')}]`);

          bcrypt.compare(pass, user.get('password'), (err, result) => {
            if (err || !result) return reject(new Error('Password did not match.'));

            resolve(user);
          });
        })
        .catch(User.NotFoundError, () => {
          reject(new Error('Couldn\'t find a user with the given email.'));
        });
    });
  },
});

module.exports = User;
