const User = require('../models/User');

// TODO All actions here are naive actions, add validation.
const users = {
  /**
   * Displays info for a user with the given ID and associated events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} Resolves to the retrieved user.
   */
  show(req, res) {
    User.where('id', req.params.id)
      .fetch({ withRelated: ['events'], require: true })
      .then(user => res.json(user.toJSON()))
      .catch(User.NotFoundError, () => res.status(404).json({ error: 'User not found.' }))
  },

  /**
   * Lists all users, each with their registered events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<Collection>} Resolves to a list of all users.
   */
  index(req, res) {
    // TODO Add pagination data via the Link header.
    User.fetchAll({ withRelated: ['events'] })
      .then(userCollection => res.json(userCollection.toJSON()))
  },

  /**
   * Creates a user.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} Resolves to the newly created user.
   */
  create(req, res) {
    // TODO Include a Location header pointing to URL of the new resource.
    new User().save(req.body)
      .then(user => res.status(201).json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () => res.status(404).json({ error: 'No records were saved.' }));
  },

  /**
   * Updates user with specified ID.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} Resolves to the newly updated user.
   */
  update(req, res) {
    User.where({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(user => res.json(user.toJSON()))
      .catch(User.NoRowsUpdatedError, () => res.status(404).json({ error: 'No records were updated.' }));
  },

  /**
   * Deletes user with specified ID.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} Resolves to destroyed and "empty" model.
   */
  delete(req, res) {
    User.where({ id: req.params.id })
      .destroy({ require: true })
      .then(() => res.sendStatus(204))
      .catch(User.NoRowsDeletedError, () => res.status(404).json({ error: 'No records were deleted.' }))
  },
};

module.exports = users;
