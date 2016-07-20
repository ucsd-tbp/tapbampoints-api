/** @file Defines custom validators for use in other controller validations. */

const users = require('./users');
const auth = require('./auth');
const User = require('../../models/User');

const custom = {
  /**
   * Checks whether an email has already been taken. Resolves when a user with
   * the given email does not exist in the database in order to indicate that
   * the email is available.
   *
   * @param  {string} email Email to check existence of.
   * @return {Promise<User>} Resolves when the email was not found.
   */
  isEmailAvailable(email) {
    return new Promise((resolve, reject) => {
      User.where('email', email)
        .fetch({ require: true })
        .then(() => reject(new Error('Email is not available.')))
        .catch(() => resolve('Email is available'));
    });
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
        .then(() => reject(new Error('Barcode is not available.')))
        .catch(() => resolve('Barcode is available.'));
    });
  },
};

const validators = {
  users,
  custom,
  auth,
};

module.exports = validators;
