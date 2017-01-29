/** @file Request validation for the authentication routes on /api/auth. */

const debug = require('debug')('tbp:auth-validator');

const auth = {
  /** Validates POST requests to /auth/register. */
  register(req, res, next) {
    debug('firing auth.register validation middleware');

    req.checkBody('email', 'Email is invalid.').isEmail();
    req.checkBody('password', 'Password must be at least 4 characters.').isLength({ min: 4 });
    req.checkBody('barcode', 'The barcode from an ID card is required.').notEmpty();

    req.check('email', 'This email has already been registered.').isEmailAvailable();
    req.check('barcode', 'This barcode has already been registered.').isBarcodeAvailable();

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
