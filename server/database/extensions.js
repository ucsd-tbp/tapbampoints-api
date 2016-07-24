/**
 * @file A subclass of Bookshelf.Model that adds extra functionality, used as
 * a plugin when initializing the Bookshelf instance.
 * @see {@link https://www.npmjs.com/package/bookshelf-mass-assignment A
 * similarly written plugin.}
 * @see index.js
 */

const Promise = require('bluebird');
const debug = require('debug')('tbp-extensions');

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
     * Overrides `Bookshelf.Model.fetch()` to validate relations passed with
     * the `withRelated` option.
     *
     * @param {Object} [options={}] Hash of options.
     * @return {Promise<Model|null>} Resolves to the fetched model or `null` if
     * none exists.
     * @see {@link http://bookshelfjs.org/#Model-instance-fetch
     * `Bookshelf.Model.fetch()` documentation}
     */
    fetch(options = {}) {
      debug('firing custom fetch with req.relations validation');

      if (!validateRelations(options.withRelated, this)) {
        return Promise.reject(new Error(
          'Names of relations to load are invalid.'
        ));
      }

      return proto.fetch.call(this, options);
    },

    /**
     * Overrides `Bookshelf.Model.fetchAll()` to validate relations.
     * @see {@link fetch}
     */
    fetchAll(options = {}) {
      debug('firing custom fetchAll with req.relations validation');

      if (!validateRelations(options.withRelated, this)) {
        return Promise.reject(new Error(
          'Names of relations to load are invalid.'
        ));
      }

      return proto.fetchAll.call(this, options);
    },
  });

  bookshelf.Model = Model;
};
