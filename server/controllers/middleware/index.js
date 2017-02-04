/** @file Exports all custom middleware. */

const acl = require('./acl');
const embed = require('./embed');
const filters = require('./filters');

module.exports = {
  acl,
  embed,
  filters,
};
