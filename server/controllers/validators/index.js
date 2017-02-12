/** @file Defines custom validators for use in other controller validations. */

const attendanceRecords = require('./attendance-records');
const auth = require('./auth');
const events = require('./events');
const users = require('./users');

const custom = {
  /**
   * Checks whether a row in the table corresponding to `model` has a row that
   * has an attribute named `identifier` with its value as `value`. This
   * validator should be used when enforcing unique fields in the database,
   * like IDs or student PIDs.
   *
   * @param {any} value Value corresponding to `identifier`.
   * @param {string} identifier Name of attribute in table.
   * @param {Model} model Bookshelf model to check.
   *
   * @return {Promise} Resolves only if a row could not be found with the given
   * criteria.
   */
  isUnique(value, identifier, model) {
    return new Promise((resolve, reject) => {
      model.where(identifier, value)
        .fetch({ require: true })
        .then(() => reject(new Error(`${identifier} with value ${value} already exists!`)))
        .catch(() => resolve());
    });
  },

  /** The reverse of `isUnique`. */
  exists(value, identifier, model) {
    return new Promise((resolve, reject) => {
      model.where(identifier, value)
        .fetch({ require: true })
        .then(() => resolve())
        .catch(() => reject(new Error(`${identifier} with value ${value} doesn't exist!`)));
    });
  },

  /**
   * Only allows 'initiate' or 'member' roles. Prevents users from registering
   * as officers or approved members.
   */
  isSafeRole(role) {
    return role === 'initiate' || role === 'pending';
  },

  /** Only allows decimal values that are multiples of 0.25. */
  isValidPointValue(pointValue) {
    return pointValue * 100 % 25 === 0;
  },

  /** Allows `value` greater than or equal to zero. */
  isNotNegative(value) {
    return value >= 0;
  },
};

const validators = {
  attendanceRecords,
  auth,
  custom,
  events,
  users,
};

module.exports = validators;
