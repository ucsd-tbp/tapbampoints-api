/**
 * @file Request validation for user routes on /users.
 * @see auth.js for related user authentication route validation.
 */

const debug = require('debug')('tbp:users-validator');

const users = {
  /** Validates PATCH requests to /api/users/:id. */
  update(req, res, next) {
    debug('firing users.update validation middleware');

    req.checkBody({
      first_name: {
        optional: true,
        notEmpty: {
          errorMessage: 'Your first name can\'t be empty.',
        },
      },

      last_name: {
        optional: true,
        notEmpty: {
          errorMessage: 'Your last name can\'t be empty.',
        },
      },

      barcode: {
        optional: true,
        notEmpty: {
          errorMessage: 'The barcode can\'t be empty.',
        },
      },

      house: {
        optional: true,
        isIn: ['red', 'green', 'blue'],
        errorMessage: 'The house must be red, green, or blue.',
      },

      member_status: {
        optional: true,
        isIn: ['Initiate', 'Member', 'Officer'],
        errorMessage: 'The member status must be Initiate, Member, or Officer.',
      },
    });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },
};

module.exports = users;
