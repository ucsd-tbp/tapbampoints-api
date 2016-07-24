/** @file Contains endpoints for event type routes on /api/event-types. */

const EventType = require('../models/EventType');

const eventTypes = {
  /** Lists all event types. */
  index(req, res) {
    EventType.fetchAll()
    .then(types => res.json(types.toJSON()))
    .catch(err => res.json({ message: err.message }));
  },
};

module.exports = eventTypes;
