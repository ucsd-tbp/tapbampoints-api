/** @file Contaisn endpoints for user routes on /api/users. */

const User = require('../models/User');

const users = {
  show(req, res, next) {
    new User().findByID(req.params.id, {
      embed: req.relations,
    })
    .then(user => res.json(user.toJSON()))
    .catch(next);
  },

  index(req, res, next) {
    new User().findAll({
      embed: req.relations,
      filters: req.filters,
    })
    .then(collection => res.json(collection.toJSON()))
    .catch(next);
  },

  update(req, res, next) {
    new User().update(req.params.id, req.body)
      .then(user => res.json(user.toJSON()))
      .catch(next);
  },

  delete(req, res, next) {
    new User().delete(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  },
};

module.exports = users;
