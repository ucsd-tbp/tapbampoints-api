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

  show(req, res, next) {
    new Event().findByID(req.params.id, {
        embed: req.relations,
      })
      .then(event => res.json(event.toJSON()))
      .catch(next);
  },

  index(req, res) {
    new Event().findAll({
        embed: req.relations,
        filters: req.filters,
      })
      .then(collection => res.json(collection.toJSON()))
      .catch(next);
  },

  update(req, res) {
    Event.where({ id: req.params.id })
      .save(req.body, { method: 'patch' })
      .then(event => res.json(event.toJSON()))
      .catch(Event.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'Event could not be updated.' })
      )
      .catch(err => res.status(400).json({ error: err.message }));
  },

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
