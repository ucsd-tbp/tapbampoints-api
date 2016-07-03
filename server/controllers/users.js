const User = require('../models/User');

const users = {
  // Displays a user given a user ID.
  show(req, res) {
    User.where('id', req.params.id)
      .fetch()
      .then(user => res.json(user.toJSON()))
      .catch(err => res.json({ message: err.message }));
  },
};

module.exports = users;
