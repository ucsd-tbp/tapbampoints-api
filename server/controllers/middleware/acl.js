/** @file A quick and hackish ACL implementation to restrict certain routes. */

const debug = require('debug')('tbp:acl');

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
  allow(roles) {
    const aclMiddleware = (req, res, next) => {
      debug('firing ACL middleware check');
      for (const role of roles) {
        switch (role) {
          case 'admin':
            if (req.user.get('is_admin')) {
              debug('user confirmed to have admin access, continuing')
              return next();
            }
            break;
          case 'owner':
            // TODO Add a check for resources that the user creates.
            if (req.user.id === parseInt(req.params.id, 10)) return next();
            break;
          default:
            return next('An invalid access group was specified.');
        }
      }

      return res.status(401).json({ error: 'Not authorized to access this route.' });
    };

    return aclMiddleware;
  },
};

module.exports = acl;
