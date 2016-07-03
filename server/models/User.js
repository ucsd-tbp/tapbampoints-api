const db = require('../database');

// Defines User model.
const User = db.Model.extend({
  tableName: 'users',
});

module.exports = User;
