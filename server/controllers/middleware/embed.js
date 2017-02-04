/** @file Defines middleware for parsing embed key in query string. */

const debug = require('debug')('tbp:embed-middleware');

/**
 * Middleware to convert embed key in URL query string to an array of the
 * desired relations to load on the model. Places the array of desired
 * relations to load in the model in `req.relations`. The list of relations to
 * load must be comma-delimited.
 *
 * @example
 *
 * // GET request to /users/1?embed=attended_events,chaired_events
 *
 * // Loads user's attended events and chaired events to return as JSON.
 * User.where('id', req.params.id)
 *   .fetch()
 *   .then(user => res.json(user.toJSON()));
 *
 * @param  {Request} req May contain an embed key in its query string.
 * @param  {Response} res HTTP response.
 * @param  {Function} next Callback to continue through the middleware stack.
 *
 * @see ../controllers/users
 */
function embed(req, res, next) {
  // No relations to load if embed query string parameter isn't specified.
  req.relations = [];

  // Continues to next middleware if there aren't any desired relations to load.
  if (!req.query.embed) return next();

  // Each relation in query parameter should be separated by a comma.
  req.relations = req.query.embed.split(',');

  // Removes embed field from query parameters to avoid being treated as a
  // WHERE clause later in the middleware stack.
  delete req.query.embed;

  debug(`found relationships to embed: ${req.relations}`);
  next();
}

module.exports = embed;
