const users = require('./users');
const eventTypes = require('./event-types');
const events = require('./events');
const auth = require('./authentication');

const controllers = {
  users,
  eventTypes,
  events,
  auth,
};

module.exports = controllers;
