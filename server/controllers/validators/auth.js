/** @file Request validation for the authentication routes on /api/auth. */

const debug = require('debug')('tbp:auth-validator');

const auth = {
  /** Validates POST requests to /auth/register. */
  register(req, res, next) {
    debug('firing auth.register validation middleware');

    req.checkBody({
      barcode: {
        notEmpty: true,
        errorMessage: 'The barcode from an ID card is required.',
      },
    });

    // Checks that if either an email or password is specified, then both the
    // email and password must exist.
    if (req.body.email || req.body.password) {
      req.checkBody({
        email: {
          isEmail: {
            errorMessage: 'Email is invalid.',
          },
        },
        password: {
          isLength: {
            options: [{ min: 4 }],
            errorMessage: 'Password must be at least 4 characters.',
          },
        },
      });

      req.check('email', 'This email has already been registered.').isEmailAvailable();
    }

    req.check('barcode', 'This barcode has already been registered.').isBarcodeAvailable();

    req.asyncValidationErrors()
      .then(() => next())
      .catch((errors) => res.status(400).json(errors));
  },

  /** Validates POST requests to /auth/login. */
  login(req, res, next) {
    debug('firing auth.login validation middleware');

    // Users can only login with just the barcode, or with an email and password
    // combination.
    if (req.body.barcode && (req.body.email || req.body.password)) {
      return res.status(400).json({
        error: 'Login is only allowed via barcode, or via an email and password combination.',
      });
    }

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },
};

module.exports = auth;
