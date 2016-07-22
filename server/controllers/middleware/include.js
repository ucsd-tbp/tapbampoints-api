/** @file Defines middleware for parsing include key in query string. */

const debug = require('debug')('tbp:include');

/**
 * Middleware to convert include key in URL query string to an array of the
 * desired relations to load on the model. Places the array of desired
 * relations to load in the model in `req.relations`. The list of relations to
 * load must be comma-delimited.
 *
 * @example
 *
 * // URL: https://api.tbp.org/users/1?include=attended_events,chaired_events
 *
 * // Loads user's attended events and chaired events to return as JSON.
 * User.where('id', req.params.id)
 *   .fetch({ withRelated: req.relations })
 *   .then(user => res.json(user.toJSON()));
 *
 * @param  {Request} req May contain an include key in its query string.
 * @param  {Response} res HTTP response.
 * @param  {Function} next Callback to continue through the middleware stack.
 *
 * @see {@link ../controllers/users}
 */
function include(req, res, next) {
  debug('checking for relations in query string');

  // Continues to next middleware if there aren't any desired relations to load.
  if (!req.query.include) return next();

  req.relations = req.query.include.split(',');
  debug(req.relations);
  next();
}

module.exports = include;
