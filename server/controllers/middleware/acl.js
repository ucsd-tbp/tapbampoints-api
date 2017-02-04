/** @file A (kinda hackish) ACL implementation to restrict certain routes. */

const debug = require('debug')('tbp:acl-middleware');
const includes = require('lodash/includes');
const toInteger = require('lodash/toInteger');

const acl = {
  /**
   * Returns middleware intended to be added to routes that require
   * authorization. Handles routes that require admin status (i.e. creating
   * events) and routes that only allow the owner to access (i.e. users should
   * only be able to update their own profiles).
   *
   * @param  {Array} roles A list of roles to check against the currently
   * logged in user.
   * @return {Function|Response} If the user satisfies all roles, then
   * continues down the middleware stack.
   */
  allowAnyOf(roles) {
    const aclMiddleware = (req, res, next) => {
      debug('firing ACL middleware check');
      const currentUserRole = req.user.related('role').toJSON().name;

      // Checks if user's role is in list of allowed roles.
      if (includes(roles, currentUserRole)) {
        debug(`${roles} contains user role ${currentUserRole}; continuing`);
        return next();
      }

      // Only continues if user owns resource being accessed.
      if (includes(roles, 'owner') && req.user.id === toInteger(req.params.id)) {
        return next();
      }

      return res.status(401).json({ error: 'Not authorized to access this route.' });
    };

    return aclMiddleware;
  },
};

module.exports = acl;
