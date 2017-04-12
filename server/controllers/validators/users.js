/**
 * @file Request validation for user routes on /users.
 * @see auth.js for related user authentication route validation.
 */

const debug = require('debug')('tbp:users-validator');
const isEmpty = require('lodash/isEmpty');

const Houses = require('../../modules/constants').Houses;
const Roles = require('../../modules/constants').Roles;

const users = {
  /** Validates PATCH requests to /api/users/:id. */
  update(req, res, next) {
    debug('firing users.update validation middleware');

    if (isEmpty(req.body)) return res.status(304).end();

    req.checkBody('first_name', 'First name can\'t be empty.').optional().notEmpty();
    req.checkBody('last_name', 'Last name can\'t be empty.').optional().notEmpty();
    req.checkBody('pid', 'PID can\'t be empty.').optional().notEmpty();

    req.checkBody('house', 'House must be red, green, or blue.').optional()
      .isIn([Houses.RED, Houses.GREEN, Houses.BLUE, Houses.NONE]);

    req.checkBody('role', 'Role must be initiate or member.').optional()
      .isIn([Roles.INITIATE, Roles.PENDING_MEMBER]);

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },

  /**
   * Checks fields required for claiming an account.
   */
  claim(req, res, next) {
    req.checkBody('first_name', 'First name can\'t be empty.').notEmpty();
    req.checkBody('last_name', 'Last name can\'t be empty.').notEmpty();

    req.checkBody('password', 'Password must be at least 6 characters.').isLength({ min: 6 });
    req.checkBody('role', 'Must register with a role as an initiate or a member.').isSafeRole();

    req.checkBody('house', 'House must be red, green, or blue.')
      .isIn([Houses.RED, Houses.GREEN, Houses.BLUE]);

    req.checkBody('role', 'Role must be initiate or member.')
      .isIn([Roles.INITIATE, Roles.PENDING_MEMBER]);

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },
};

module.exports = users;
