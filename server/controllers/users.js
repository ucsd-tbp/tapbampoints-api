/** @file Contaisn endpoints for user routes on /api/users. */

const User = require('../models/User');

const users = {
  /**
   * Creates a token that the user can use to verify their account, given the
   * ID of the user to be verified. Then, sends an email with a link that the
   * user can use to claim their account.
   */
  generateVerificationToken(req, res) {
    if (!req.body.id) {
      return res.status(400).json({ message: 'ID of account to verify is required.' });
    }
  },

  /** Displays info for a user with the given ID and associated events. */
  show(req, res) {
    new User().findByID(req.params.id, { embed: req.relations })
      .then(user => res.json(user.toJSON()))
      .catch(User.NotFoundError, () => res.status(404).json({ error: 'User not found.' }))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Lists all users. */
  index(req, res) {
    // TODO Add pagination data via the Link header.
    new User().findAll({ embed: req.relations, filters: req.filters })
      .then(userCollection => res.json(userCollection.toJSON()))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Updates user with ID given in request parameters. */
  update(req, res) {
    User.where({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(user => res.json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'User could not be updated.' })
      )
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Deletes user with ID given in request parameters. */
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
