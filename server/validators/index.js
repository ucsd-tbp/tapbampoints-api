const debug = require('debug')('tbp:validators');

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
        .then(user => reject(new Error('Email is not available.')))
        .catch(err => resolve('Email is available'));
    });
  },
};

const validators = {
  users,
  custom,
  auth,
};

module.exports = validators;
