/** @file Defines CRUD controller operations on the User model. */

const User = require('../models/User');

const users = {
  /**
   * Displays info for a user with the given ID and associated events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP respones, contains retrieved user
   */
  show(req, res) {
    User.where('id', req.params.id)
      .fetch({ withRelated: ['events'], require: true })
      .then(user => res.json(user.toJSON()))
      .catch(User.NotFoundError, () => res.status(404).json({ error: 'User not found.' }));
  },

  /**
   * Lists all users, each with their registered events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   */
  index(req, res) {
    // TODO Add pagination data via the Link header.
    User.fetchAll({ withRelated: ['events'] })
      .then(userCollection => res.json(userCollection.toJSON()));
  },

  /**
   * Creates a user.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   */
  create(req, res) {
    // TODO Include a Location header pointing to URL of the new resource.
    new User().save(req.body)
      .then(user => res.status(201).json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'No records were saved.' }));
  },

  /**
   * Updates user with ID given in request parameters.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   */
  update(req, res) {
    User.where({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(user => res.json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () =>
        res.status(404).json({ error: 'No records were updated.' }));
  },

  /**
   * Deletes user with ID given in request parameters.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   */
  delete(req, res) {
    User.where({ id: req.params.id })
      .destroy({ require: true })
      .then(() => res.sendStatus(204))
      .catch(User.NoRowsDeletedError, () =>
        res.status(404).json({ error: 'No records were deleted.' }));
  },
};

module.exports = users;
