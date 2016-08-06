/**
 * @file A subclass of Bookshelf.Model that adds extra functionality, used as
 * a plugin when initializing the Bookshelf instance.
 *
 * @see {@link https://www.npmjs.com/package/bookshelf-mass-assignment A
 * similarly written plugin.}
 * @see ./index.js
 */

const Promise = require('bluebird');
const _ = require('lodash');

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

      if (options.queryable) this.queryable = _.clone(options.queryable);
    },

    /**
     * Finds a model given its ID.
     *
     * @param  {int} id
     * @param  {Object} [options={}] Hash of options for querying and fetching.
     * @return {Promise<Model>} Resolves to model with given ID.
     */
    findByID(id, options = {}) {
      options.filters = options.filters || {};
      options.filters.id = id;
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
     * @param  {Boolean} [returnCollection=false] Whether to return a
     * collection or a single model.
     * @return {Promise<Model>|Promise<Collection>} Resolves to either a model
     * or a collection depending on `returnCollection`.
     */
    find(options = {}, returnCollection = false) {
      options.filters = options.filters || {};

      // Removes parameters from query that aren't in queryable attributes.
      Object.keys(options.filters).forEach(param => {
        if (param !== 'id' && this.queryable && this.queryable.indexOf(param) === -1) {
          delete options.filters[param];
        }
      });

      // Validates values in embed query string parameter.
      if (options.embed) {
        if (!validateRelations(options.embed, this)) {
          return Promise.reject(new Error(
            'Names of relations to load are invalid.'
          ));
        }
      }

      const builder = this.query({ where: options.filters });

      // Returns a collection if called from findAll.
      if (returnCollection) {
        return builder.fetchAll({ withRelated: options.embed });
      }

      return builder.fetch({ withRelated: options.embed, require: true });
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
