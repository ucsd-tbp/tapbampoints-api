/** @file Request validation middleware for users routes. */

const debug = require('debug')('tbp:users-validator');

const users = {
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
        isIn: ['Red', 'Green', 'Blue'],
        errorMessage: 'The house must be Red, Green, or Blue.',
      },

      member_status: {
        optional: true,
        isIn: ['Initiate', 'Member', 'Officer'],
        errorMessage: 'The member status must be Initiate, Member, or Officer.',
      },
    });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    // Allows currently logged in users to only update their own profiles.
    if (req.user.id !== parseInt(req.params.id, 10)) {
      return res.status(401).json({ error: 'You can\'t update this user\'s profile.' });
    }

    next();
  },
};

module.exports = users;
