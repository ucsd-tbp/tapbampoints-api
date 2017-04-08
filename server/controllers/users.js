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

  update(req, res) {
    User.where({ id: req.params.id })
      .save(req.body, { method: 'update' })
      .then(user => res.json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'User could not be updated.' })
      )
      .catch(err => res.status(400).json({ error: err.message }));
  },

  delete(req, res) {
    User.where({ id: req.params.id })
      .destroy({ require: true })
      .then(() => res.sendStatus(204))
      .catch(User.NoRowsDeletedError, () =>
        res.status(404).json({ error: 'User not found.' })
      );
  },
};

module.exports = users;
