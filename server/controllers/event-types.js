/** @file Contains endpoints for event type routes on /api/event-types. */

const EventType = require('../models/EventType');

const eventTypes = {

  /** Shows event type with ID given in request parameters. */
  show(req, res) {
    new EventType().findByID(req.params.id, { embed: req.relations })
      .then(eventType => res.json(eventType.toJSON()))
      .catch(EventType.NotFoundError, () => res.status(404).json({
        error: 'Event type not found.',
      }))
      .catch(err => res.status(400).json({ message: err.message }));
  },

  /** Lists all event types. */
  index(req, res) {
    new EventType().findAll({ embed: req.relations, filters: req.filters })
      .then(types => res.json(types.toJSON()))
      .catch(err => res.json({ error: err.message }));
  },
};

module.exports = eventTypes;
