const User = require('../models/User');

const users = {
  /**
   * Displays info for a user with the given ID.
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
};

module.exports = users;
