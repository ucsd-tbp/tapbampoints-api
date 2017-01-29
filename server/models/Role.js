/**
 * @file Defines Role model. Used to describe certain roles that a user can
 * have, e.g. initiate, member, or officer roles.
 */

const db = require('../database');

const Role = db.model('Role', {
  tableName: 'roles',
  fillable: ['name', 'display_name', 'description'],

  relationships: {
    /** Users that are assigned to a certain role. */
    users() {
      return this.hasMany('User');
    },
  },
});

module.exports = Role;
