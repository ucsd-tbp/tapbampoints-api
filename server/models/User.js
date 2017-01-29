/** @file Defines User model. */

const bcrypt = require('bcrypt');
const debug = require('debug')('tbp:user-model');

require('./Event');
const db = require('../database');

const Role = require('./Role');

const User = db.model('User', {
  tableName: 'users',

  // Attributes that aren't serialized when converting a User to JSON.
  hidden: ['password', 'barcode'],

  // Attributes that are not mass-assignable.
  guarded: ['id'],

  // Attributes that can be used to search, filter, or sort collection results.
  queryable: ['email', 'first_name', 'last_name', 'house', 'member_status'],

  /** Registers event listeners. */
  initialize() {
    // TODO Write unit tests for hashing password on update.
    this.on('saving', this.hashPassword);
    this.on('saving', this.convertRoletoID);
  },

  relationships: {
    /** Events this user has chaired. */
    chaired_events() {
      return this.hasMany('Event', 'officer_id');
    },

    /** Events that this user has attended. */
    attended_events() {
      return this.belongsToMany('Event', 'attendance_records');
    },

    /** Permission role. */
    role() {
      return this.belongsTo('Role');
    },
  },

  /**
   * Event listener that hashes the  password when a user is created.
   * @return {Promise<string>} Resolves to hashed password.
   */
  hashPassword() {
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
   * When updating user or saving, if the `role` property exists, converts
   * the string to an ID to place in the `role_id`.
   * @return {Promise} Resolves if role with attributes.name is found.
   */
  convertRoletoID() {
    // Stops if role field isn't in attributes to be saved/updated.
    if (!hasOwnProperty.call(this.attributes, 'role')) return;

    return Role.where('name', this.attributes.role).fetch({ require: true })
      .then((role) => {
        // Replaces `role` property with `role_id`.
        delete this.attributes.role;
        this.set('role_id', role.id);

        debug(this.attributes);
      });
  },

  /**
   * Logs in a user via an email and password.
   *
   * @param {String} email Email to attempt login with.
   * @param {String} password Password corresponding to email.
   *
   * @return {Promise<User>} resolves to newly logged in user if login was
   * successful.
   */
  login(email, password) {
    // FIXME Fix Promise anti-patterns, i.e. new Promise() and nesting Promises.
    return User.where('email', email)
      .fetch({ require: true, withRelated: ['role'] })
      .then(user =>
        new Promise((resolve, reject) => {
          // Checks for password correctness.
          bcrypt.compare(password, user.get('password'), (err, result) => {
            if (err) return reject(err);
            if (!result) return reject(new Error('The email and password entered don\'t match.'));

            resolve(user);
          });
        })
      );
  },
});

module.exports = User;
