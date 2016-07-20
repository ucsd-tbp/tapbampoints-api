/**
 * @file Puts together all controller actions from each module and exports all
 * controllers an object for use in creating routes.
 *
 * @see ../routes/index.js
 */

const users = require('./users');
const eventTypes = require('./event-types');
const events = require('./events');
const auth = require('./auth');

const controllers = {
  users,
  eventTypes,
  events,
  auth,
};

module.exports = controllers;
