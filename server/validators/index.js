const users = require('./users');
const auth = require('./authentication');
const User = require('../models/User');

const custom = {
  /**
   * Checks whether an email has already been taken. Resolves when a user with
   * the given email does not exist in the database in order to indicate that
   * the email is available.
   *
   * @param  {String} email email to check existence of
   * @return {Promise<User>} resolves when the email was not found
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
   * {%link #isEmailAvailable}.
   *
   * @param  {String}  barcode barcode to check existence of
   * @return {Promise<User>} resolves when barcode was not found
   */
  isBarcodeAvailable(barcode) {
    return new Promise((resolve, reject) => {
      User.where('barcode', barcode)
        .fetch({ require: true })
        .then(() => reject(new Error('Barcode is not available.')))
        .catch((err) => resolve('Barcode is available.'));
    });
  },
};

const validators = {
  users,
  custom,
  auth,
};

module.exports = validators;
