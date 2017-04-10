/** @file Contains endpoints for announcements routes on /announcements. */

const Announcement = require('../models/Announcement');

const announcements = {
  /** Lists all announcements. */
  index(req, res, next) {
    new Announcement().findAll({
      embed: req.relations,
      filters: req.filters,
    })
    .then(collection => res.json(collection.toJSON()))
    .catch(next);
  },
};

module.exports = announcements;
