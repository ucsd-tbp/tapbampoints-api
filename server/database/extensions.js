/**
 * @file A subclass of Bookshelf.Model that adds extra functionality, used as
 * a plugin when initializing the Bookshelf instance.
 * @see {@link https://www.npmjs.com/package/bookshelf-mass-assignment A
 * similarly written plugin.}
 * @see index.js
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

    findByID(id, options = {}) {
      options.filters = options.filters || {};
      options.filters.id = id;
      return this.find(options);
    },

    findAll(options = {}) {
      return find(options, true)
    },

    find(options = {}, returnCollection = false) {
      if (options.filters) {
        // Removes parameters from query that aren't in queryable attributes.
        Object.keys(options.filters).forEach(param => {
          if (param !== 'id' && this.queryable && this.queryable.indexOf(param) === -1) {
            delete param;
          }
        });
      }

      if (options.embed) {
        if (!validateRelations(options.embed, this)) {
          return Promise.reject(new Error(
            'Names of relations to load are invalid.'
          ));
        }
      }

      const builder = this.query({ where: options.filters })

      return this.query({ where: options.filters })
        .fetch({ withRelated: options.embed, require: true })

      if (returnCollection) {
        return builder.fetchAll({ withRelated: options.embed })
      }

      return builder.fetch({ withRelated: options.embed, require: true })
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
