/** @file Defines middleware for parsing filters from the query string.. */

const debug = require('debug')('tbp:filters-middleware');

const map = require('lodash/map');
const isEmpty = require('lodash/isEmpty');
const endsWith = require('lodash/endsWith');

/**
 * Middleware that converts the remaining query string parameters into a format
 * easily placed into a WHERE clause when hitting the database. This array of
 * objects is placed on the `req.filters` object for the controllers to use.
 *
 * @example
 *
 * Making a GET request to URL /users?first_name=Luke&house=red would create an
 * array of objects:
 *
 * [{ key: 'first_name', value: 'Luke', comparison: '=' },
 *  { key: 'house', value: 'red', comparison: '=' }]
 *
 * so that a WHERE clause can be more easily constructed via a query builder by
 * chaining `andWhere(key, comparison, value)` calls. See
 * server/database/extensions for where this is done.
 *
 * This middleware function MUST be the last middleware function to run before
 * hitting the controllers, since this is the catch-all (i.e. any query
 * parameter that wasn't deleted earlier in the middleware stack must have been
 * meant to use as a WHERE filter).
 */
function filters(req, res, next) {
  req.filters = [];

  // If all query string parameters have been deleted earlier in the middleware
  // stack, then there's nothing to do.
  if (isEmpty(req.query)) return next();

  req.filters = map(req.query, (value, key) => {
    // Default WHERE clause comparison operator.
    let comparison = '=';

    // Ending a query parameter with `Min` indicates that the parameter should
    // be minimum the value it provides. Minimum value bound is inclusive, and
    // upper bound is exclusive.
    //
    // For example, /events?startMin=2020-01-18 14:00:00 indicates that only the
    // events after a certain date should be included.
    if (endsWith(key, 'Min')) {
      comparison = '>=';
      // Removes 'Min' from end of string to restore original attribute name.
      key = key.slice(0, -3);
    } else if (endsWith(key, 'Max')) {
      comparison = '<';
      key = key.slice(0, -3);
    }

    return { key, comparison, value };
  });

  debug(req.filters);
  next();
}

module.exports = filters;
