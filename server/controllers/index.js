/**
 * @file Puts together all controller actions from each module and exports all
 * controllers an object for use in creating routes.
 *
 * @see ../routes/index.js
 */

const attendanceRecords = require('./attendance-records');
const auth = require('./auth');
const events = require('./events');
const eventTypes = require('./event-types');
const users = require('./users');

const controllers = {
  attendanceRecords,
  auth,
  events,
  eventTypes,
  users,
};

module.exports = controllers;
