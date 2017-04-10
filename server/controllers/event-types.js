/** @file Contains endpoints for event type routes on /api/event-types. */

const EventType = require('../models/EventType');

const eventTypes = {
  show(req, res, next) {
    new EventType().findBy('id', req.params.id, {
      embed: req.relations,
    })
    .then(type => res.json(type.toJSON()))
    .catch(next);
  },

  index(req, res, next) {
    new EventType().findAll({
      embed: req.relations,
      filters: req.filters,
    })
    .then(collection => res.json(collection.toJSON()))
    .catch(next);
  },
};

module.exports = eventTypes;
