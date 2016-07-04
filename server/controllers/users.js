const User = require('../models/User');

// TODO All actions here are naive actions, add validation.
const users = {
  /**
   * Displays info for a user with the given ID and associated events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} User with given ID.
   */
  show(req, res) {
    User.where('id', req.params.id)
      .fetch({ withRelated: ['events'] })
      .then(user => res.json(user.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },

  /**
   * Lists all users, each with their registered events.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<Collection>} List of all users.
   */
  index(req, res) {
    // TODO Add pagination data via the Link header
    User.fetchAll({ withRelated: ['events'] })
      .then(userCollection => res.json(userCollection.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },

  /**
   * Creates a user.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<User>} Newly created user.
   */
  create(req, res) {
    // TODO Include a Location header pointing to URL of the new resource.
    new User().save(req.body)
      .then(user => res.json(user.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },

  /**
   * Updates a user.
   *
   * @param  {Request} req HTTP request object
   * @param  {Response} res HTTP response sent after receiving a request
   * @return {Promise<Collection>} List of all users.
   */
  update(req, res) {
    User.where({ id: req.params.id })
      .save(req.body, { patch: true })
      .then(user => res.json(user.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },
};

module.exports = users;
