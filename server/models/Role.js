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
      return this.hasMany('User', 'role_id');
    },
  },

  /**
   * Given a role unique name, retrieves the role's corresponding ID.
   *
   * @private
   * @param {String} name Name of role, e.g. 'initiate' or 'member'.
   * @return {Promise} Resolves to role ID if found.
   */
  updateWithRoleID(user) {
    if (!Object.hasOwnProperty('role')) {
      throw new Error('Role property doesn\'t exist on the given user object!');
    }

    return Role.where('name', name).fetch({ require: true });
  },
});

module.exports = Role;
