/** @file Contains endpoints for event routes on /api/events. */

const Event = require('../models/Event');

const events = {
  create(req, res, next) {
    new Event().create(req.body)
      .then(event => res.status(201).json(event.toJSON()))
      .catch(next);
  },

  show(req, res, next) {
    new Event().findByID(req.params.id, {
      embed: req.relations,
    })
    .then(event => res.json(event.toJSON()))
    .catch(next);
  },

  index(req, res, next) {
    new Event().findAll({
      embed: req.relations,
      filters: req.filters,
    })
    .then(collection => res.json(collection.toJSON()))
    .catch(next);
  },

  update(req, res, next) {
    new Event().update(req.params.id, req.body)
      .then(event => res.json(event.toJSON()))
      .catch(next);
  },

  delete(req, res, next) {
    new Event().delete(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  },
};

module.exports = events;
