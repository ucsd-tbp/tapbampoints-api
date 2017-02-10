/**
 * @file Request validation for user routes on /users.
 * @see auth.js for related user authentication route validation.
 */

const debug = require('debug')('tbp:users-validator');

const Houses = require('../../modules/constants').Houses;
const Roles = require('../../modules/constants').Roles;

const users = {
  /** Validates PATCH requests to /api/users/:id. */
  update(req, res, next) {
    debug('firing users.update validation middleware');

    req.checkBody('first_name', 'First name can\'t be empty.').optional().notEmpty();
    req.checkBody('last_name', 'Last name can\'t be empty.').optional().notEmpty();
    req.checkBody('pid', 'PID can\'t be empty.').optional().notEmpty();

    req.checkBody('house', 'House must be red, green, or blue.').optional()
      .isIn([Houses.RED, Houses.GREEN, Houses.BLUE]);

    req.checkBody('role', 'Role must be initiate or member.').optional()
      .isIn([Roles.INITIATE, Roles.PENDING]);

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },
};

module.exports = users;
