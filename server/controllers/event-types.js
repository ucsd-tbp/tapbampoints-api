/** @file Contains endpoints for event type routes on /api/event-types. */

const EventType = require('../models/EventType');

const eventTypes = {
  /**
   * Lists all event types.
   *
   * @param  {Request} req HTTP request object.
   * @param  {Response} res HTTP response object.
   */
  index(req, res) {
    EventType.fetchAll()
    .then(types => res.json(types.toJSON()))
    .catch(err => res.json({ message: err.message }));
  },
};

module.exports = eventTypes;
