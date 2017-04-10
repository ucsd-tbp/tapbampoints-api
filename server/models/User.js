/** @file Defines User model. */

const bcrypt = require('bcrypt');
const debug = require('debug')('tbp:user-model');
const isEmpty = require('lodash/isEmpty');

require('./Event');

const db = require('../database');
const Role = require('./Role');
const { SALT_ROUNDS } = require('../modules/constants');
const { UnauthorizedError } = require('../modules/errors');

const User = db.model('User', {
  // Database table that this model and its attributes correspond to.
  tableName: 'users',

  // Attributes that aren't serialized when converting a User to JSON.
  hidden: ['password', 'role_id', 'valid', 'email_verification_code'],

  // Attributes that are not mass-assignable.
  guarded: ['id', 'valid', 'email_verification_code'],

  // Attributes that can be used to search, filter, or sort collection results.
  queryable: ['email', 'first_name', 'last_name', 'house', 'pid'],

  // Attributes that aren't in the database, but are calculated on the fly
  // based on in-database attributes.
  virtuals: {
    // Convenience getter and setter for retrieving the full name of a user
    // instead of concatenating first_name and last_name each time.
    full_name: {
      get() {
        return `${this.get('first_name')} ${this.get('last_name')}`;
      },

      set(value) {
        const [firstName, lastName] = value.split(' ');
        this.set('first_name', firstName);
        this.set('last_name', lastName);
      },
    },
  },

  // Removes virtual properties from JSON output.
  outputVirtuals: false,

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

  /** Registers event listeners. */
  initialize() {
    this.on('saving', this.hashPassword);
    this.on('saving', this.convertRoletoID);
    this.on('saving', this.updatedValidStatus);
  },

  /**
   * Event listener that hashes the  password when a user is created.
   * @return {Promise<string>} Resolves to hashed password.
   */
  hashPassword() {
    if (!this.attributes.password) return Promise.resolve();

    return bcrypt.hash(this.attributes.password, SALT_ROUNDS)
      .then(hash => this.set('password', hash));
  },

  /**
   * When updating user or saving, if the `role` property exists, converts
   * the string to an ID to place in the `role_id`.
   * @return {Promise} Resolves if role with attributes.name is found.
   */
  convertRoletoID() {
    // Stops if role field isn't in attributes to be saved/updated.
    if (!hasOwnProperty.call(this.attributes, 'role')) return Promise.resolve();

    return Role.where('name', this.attributes.role).fetch({ require: true })
      .then((role) => {
        // Replaces `role` property with `role_id`.
        delete this.attributes.role;
        this.set('role_id', role.id);
      });
  },

  /**
   * Checks the password field to determine whether the user is valid or not.
   * If the user doesn't have a password, then the user isn't valid and cannot
   * login, and must request an email verification code to set their password.
   */
  updatedValidStatus() {
    const password = this.attributes.password ? this.attributes.password : this.get('password');
    this.set('valid', !isEmpty(password));
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
    return User.where('email', email)
      .fetch({ require: true, withRelated: ['role'] })
      .then((user) => {
        if (!user.get('valid')) {
          return Promise.reject(new Error('Your account hasn\'t been verified.'));
        }

        return Promise.all([user, bcrypt.compare(password, user.get('password'))]);
      })
      .then(([user, comparisonResult]) => {
        if (!comparisonResult) {
          throw new UnauthorizedError('The email and password entered don\'t match.');
        }

        console.log(comparisonResult);

        return user;
      });
  },
});

module.exports = User;
