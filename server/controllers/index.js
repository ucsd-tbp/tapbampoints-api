/**
 * @file Puts together all controller actions from each module and exports all
 * controllers an object for use in creating routes.
 *
 * @see ../routes/index.js
 */

const announcements = require('./announcements');
const attendanceRecords = require('./attendance-records');
const auth = require('./auth');
const events = require('./events');
const eventTypes = require('./event-types');
const users = require('./users');
const verification = require('./verification');

const controllers = {
  announcements,
  attendanceRecords,
  auth,
  events,
  eventTypes,
  users,
  verification,
};

module.exports = controllers;
