/** @file Request validation middleawre for users routes. */
const debug = require('debug')('tbp:validator');

const users = {
  update(req, res, next) {
    debug('firing users.update validation middleware');
    next();
  },
};

module.exports = users;
