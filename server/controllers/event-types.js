/** @file Contains endpoints for event type routes on /api/event-types. */

const EventType = require('../models/EventType');

const eventTypes = {

  /** Shows event type with ID given in request parameters. */
  show(req, res) {
    EventType.where('id', req.params.id)
      .fetch({ withRelated: req.relations, require: true })
      .then(eventType => res.json(eventType.toJSON()))
      .catch(EventType.NotFoundError, () => res.status(404).json({
        error: 'Event type not found.',
      }))
      .catch(err => res.status(400).json({ message: err.message }));
  },

  /** Lists all event types. */
  index(req, res) {
    EventType.fetchAll()
    .then(types => res.json(types.toJSON()))
    .catch(err => res.json({ message: err.message }));
  },
};

module.exports = eventTypes;
