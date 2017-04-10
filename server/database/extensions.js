/**
 * @file A subclass of Bookshelf.Model that adds extra functionality, used as
 * a plugin when initializing the Bookshelf instance.
 *
 * @see {@link https://www.npmjs.com/package/bookshelf-mass-assignment A
 * similarly written plugin.}
 * @see ./index.js
 */

const clone = require('lodash/clone');
const forEach = require('lodash/forEach');
const includes = require('lodash/includes');

const {
  MalformedRequestError,
  ResourceNotUpdatedError,
  ResourceNotFoundError,
  InternalServerError,
} = require('../modules/errors');

/**
 * Checks that every relation in `requestedRelations` exists in the
 * `model.relationships` object.
 *
 * @private
 * @param  {Array} requestedRelations A list of relation names to laod.
 * @param  {Model} model Model containing relations to check against.
 * @return {boolean} True if all of the requested relations match some relation
 * key on the model.
 */
function validateRelations(requestedRelations, model) {
  // Passes validation if there aren't any relations to check.
  if (!requestedRelations) return true;

  return requestedRelations.every(relation =>
    Object.keys(model.relationships).indexOf(relation) >= 0
  );
}

module.exports = bookshelf => {
  const proto = bookshelf.Model.prototype;

  const Model = bookshelf.Model.extend({
    /**
     * Creates queryable field on the model's prototype when defining
     * attributes in a model that can be filtered or sorted.
     */
    constructor(...args) {
      proto.constructor.call(this, ...args);
      const options = args[1] || {};

      if (options.queryable) this.queryable = clone(options.queryable);
    },

    /**
     * Deals with Promises returned as a result of Bookshelf ORM calls and
     * converts Bookshelf errors to custom errors that the global error handler
     * in app.js can interpret.
     *
     * @param  {Error} error Bookshelf ORM error to handle.
     * @return {Promise} Rejected promise with the custom error if a Bookshelf
     * error was thrown.
     */
    resourceErrorHandler(error) {
      if (error instanceof Model.NotFoundError) {
        throw new ResourceNotFoundError();
      } else if (error instanceof Model.NoRowsDeletedError
              || error instanceof Model.NoRowsUpdatedError) {
        throw new ResourceNotUpdatedError();
      } else {
        throw new InternalServerError();
      }
    },

    /**
     * Finds a model given its ID.
     *
     * @param  {int} id
     * @param  {Object} [options={}] Hash of options for querying and fetching.
     * @return {Promise<Model>} Resolves to model with given ID.
     */
    findBy(attribute, value, options = {}) {
      options.filters = options.filters || [];
      options.filters.push({ key: attribute, comparison: '=', value });

      return this.find(options);
    },

    /**
     * Finds a collection of models that match the provided filters. Overrides
     * Bookshelf's fetch and fetchAll in order to validate request query string
     * and to have defaults for commonly used options.
     *
     * @param  {Object} [options={}] Hash of options for querying and fetching.
     * @return {Promise<Collection>} Resolves to model collection.
     */
    findAll(options = {}) {
      return this.find(options, true);
    },

    /**
     * Validates query string parameters and fetches a model with the requested
     * relations based on the provided filters. Typically called from either
     * findByID or findAll.
     *
     * @param {Object} [options={}] Hash of options.
     * @param  {Boolean} [isCollection=false] Whether to return a
     * collection or a single model.
     * @return {Promise<Model>|Promise<Collection>} Resolves to either a model
     * or a collection depending on `isCollection`.
     */
    find(options = {}, isCollection = false) {
      options.filters = options.filters || [];

      // Removes parameters from query that aren't in queryable attributes.
      Object.keys(options.filters).forEach(param => {
        if (param !== 'id' && this.queryable && !includes(this.queryable, param)) {
          delete options.filters.param;
        }
      });

      // All relationships in the embed query string parameter must be valid
      // relationships defined on the model.
      if (options.embed && !validateRelations(options.embed, this)) {
        throw new MalformedRequestError('Names of relations to load are invalid.');
      }

      // Creates a series of WHERE clauses according to the objects in
      // `options.filters`, which is an array of objects. See
      // sever/controllers/middleware/filters.js for more info on how the
      // `filters` property is added to the request object.
      const builder = this.query((queryBuilder) => {
        forEach(options.filters, (clause) =>
          queryBuilder.andWhere(clause.key, clause.comparison, clause.value)
        );
      });

      // Returns a collection if `find` was called from `findAll`.
      if (isCollection) {
        return builder.fetchAll({ withRelated: options.embed })
          .catch(this.resourceErrorHandler);
      }

      // Otherwise, returns a single model.
      return builder.fetch({ withRelated: options.embed, require: true })
        .catch(this.resourceErrorHandler);
    },

    create(body) {
      return this.save(body)
        .catch(this.resourceErrorHandler);
    },

    update(id, body) {
      return this.where({ id })
        .save(body, { method: 'update', require: true })
        .catch(this.resourceErrorHandler);
    },

    delete(id) {
      return this.where({ id })
        .destroy({ require: true })
        .catch(this.resourceErrorHandler);
    },

    /**
     * Overrides model conversion to JSON to omit _pivot attributes in the
     * returned JSON.
     *
     * @param {Object} options Hash of options.
     */
    toJSON(options) {
      const opts = options || {};
      opts.omitPivot = true;

      return proto.toJSON.call(this, opts);
    },
  });

  bookshelf.Model = Model;
};
