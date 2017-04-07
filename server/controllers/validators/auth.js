/** @file Request validation for the authentication routes on /api/auth. */

const User = require('../../models/User');
const debug = require('debug')('tbp:auth-validator');

const auth = {
  /** Validates POST requests to /auth/register. */
  register(req, res, next) {
    debug('firing auth.register validation middleware');

    req.checkBody('email', 'Email is invalid.').isEmail();
    req.checkBody('email', 'This email has already been registered.').isUnique('email', User);

    // If the password is part of the request body, then a user is manually
    // creating an account.
    if (req.body.password) {
      req.checkBody('password', 'Password must be at least 6 characters.').isLength({ min: 6 });
      req.checkBody('role', 'Must register with a role as an initiate or a member.').isSafeRole();

      req.checkBody('pid', 'The PID from an ID card is required.').notEmpty();
      req.checkBody('pid', 'This PID has already been registered.').isUnique('pid', User);
    }

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },

  /** Validates POST requests to /auth/login. */
  login(req, res, next) {
    debug('firing auth.login validation middleware');

    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },
};

module.exports = auth;
