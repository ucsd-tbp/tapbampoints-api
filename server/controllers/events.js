const Event = require('../models/Event');

const events = {
  /**
   * Displays info for an event with the given ID along with its associated
   * users (members that signed in to the event).
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<Event>} Event with given ID.
   */
  show(req, res) {
    Event.where('id', req.params.id)
      .fetch({ withRelated: ['users'] })
      .then(event => res.json(event.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },
};

module.exports = events;
