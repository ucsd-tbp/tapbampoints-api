/** @file Contains endpoints for event routes on /api/events. */

const Event = require('../models/Event');

const events = {
  create(req, res) {
    new Event().save(req.body)
      .then(event => res.status(201).json(event.toJSON()))
      .catch(Event.NoRowsUpdatedError, () => res.status(400).json({
        error: 'Event was not saved!',
      }))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Shows event with ID given in request parameters. */
  show(req, res) {
    Event.where('id', req.params.id)
      .fetch({ withRelated: req.relations, require: true })
      .then(event => res.json(event.toJSON()))
      .catch(Event.NotFoundError, () => res.status(404).json({ error: 'Event not found.' }))
      .catch(err => res.status(400).json({ message: err.message }));
  },

  /** Lists all events. */
  index(req, res) {
    Event.fetchAll({ withRelated: req.relations })
      .then(eventCollection => res.json(eventCollection.toJSON()));
  },

  /** Updates event with ID in request parameters. */
  update(req, res) {
    Event.where({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(event => res.json(event.toJSON()))
      .catch(Event.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'Event could not be updated.' })
      )
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Deletes event with ID given in request parameters. */
  delete(req, res) {
    Event.where({ id: req.params.id })
      .destroy({ require: true })
      .then(() => res.sendStatus(204))
      .catch(Event.NoRowsDeletedError, () =>
        res.status(404).json({ error: 'Event not found.' })
      );
  },
};

module.exports = events;
