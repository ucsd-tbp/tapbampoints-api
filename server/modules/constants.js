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

  // MySQL date format for date/time objects.
  DATABASE_DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  // Datetime string for the beginning of time (practically) in ISO format.
  EPOCH_ISO_DATETIME: '1970-01-01T00:00:00.000Z',

  // Salt rounds used when hashing passwords and tokens via bcrypt.
  SALT_ROUNDS: 10,

  // SMTP configuration to send email to users.
  EMAIL_TRANSPORT_CONFIG: Object.freeze({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  }),

  EMAIL_SENDER: '"Brian Tan" <tbpointsapp@gmail.com>',
};

module.exports = constants;
