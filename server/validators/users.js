/** @file Request validation middleware for users routes. */

const debug = require('debug')('tbp:users-validator');

const users = {
  update(req, res, next) {
    debug('firing users.update validation middleware');

    req.checkBody({
      first_name: {
        optional: true,
      }
    });

    next();
  },
};

module.exports = users;
