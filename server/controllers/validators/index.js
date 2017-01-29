/** @file Defines custom validators for use in other controller validations. */

const attendanceRecords = require('./attendance-records');
const auth = require('./auth');
const events = require('./events');
const users = require('./users');

const User = require('../../models/User');

// TODO Move validation to the model layer for reduced repetition.
const custom = {
  /**
   * Checks whether an email has already been taken. Resolves when a user with
   * the given email does not exist in the database in order to indicate that
   * the email is available.
   *
   * @param  {String} email Email to check existence of.
   * @return {Promise<User>} Resolves when the email was not found.
   */
  isEmailAvailable(email) {
    return new Promise((resolve, reject) => {
      User.where('email', email)
        .fetch({ require: true })
        .then(() => reject())
        .catch(() => resolve());
    })
  },

  /**
   * Checks whether a barcode has already been taken, similar to
   * {@link isEmailAvailable} above.
   *
   * @param  {string} barcode Barcode to check existence of.
   * @return {Promise<User>} Resolves when barcode was not found.
   */
  isBarcodeAvailable(barcode) {
    return new Promise((resolve, reject) => {
      User.where('barcode', barcode)
        .fetch({ require: true })
        .then(() => reject())
        .catch(() => resolve());
    })
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
