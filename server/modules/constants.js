/** @file A series of application-wide constants. */

const constants = {
  Roles: Object.freeze({
    INITIATE: 'initiate',
    PENDING_MEMBER: 'pending',
    MEMBER: 'member',
    INACTIVE_MEMBER: 'inactive',
    OFFICER: 'officer',
    ADMIN: 'admin',
  }),

  EventTypes: Object.freeze({
    ACADEMIC: 'academic',
    SOCIAL: 'social',
    SERVICE: 'service',
    WILDCARD: 'wildcard',
  }),

  Houses: Object.freeze({
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue',
    NONE: 'none',
  }),
};

module.exports = constants;
