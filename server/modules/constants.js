/** @file A series of application-wide constants. */

const constants = {
  MemberStatuses: Object.freeze({
    INITIATE: 'initiate',
    PENDING_MEMBER: 'pending',
    MEMBER: 'member',
    INACTIVE: 'inactive',
    OFFICER: 'officer',
    ADMIN: 'admin',
  }),

  EventTypes: Object.freeze({
    ACADEMIC: 'academic',
    SOCIAL: 'social',
    SERVICE: 'service',
    WILDCARD: 'wildcard',
  }),
};

module.exports = constants;
