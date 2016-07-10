/** @file Request validation for the authentication routes. */

const debug = require('debug')('tbp:auth-validator');

const auth = {
  register(req, res, next) {
    debug('firing auth.register validation middleware');

    req.checkBody({
      barcode: {
        notEmpty: true,
        errorMessage: 'The barcode from an ID card is required.',
      },
    });

    // Checks that if either an email or password is specified, then both hte
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

    req.asyncValidationErrors()
      .then(() => next())
      .catch((errors) => res.status(400).json(errors));
  },
};

module.exports = auth;
