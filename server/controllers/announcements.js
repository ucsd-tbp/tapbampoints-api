/** @file Contains endpoints for announcements routes on /announcements. */

const Announcement = require('../models/Announcement');

const announcements = {
  /** Lists all announcements. */
  index(req, res) {
    new Announcement().findAll({ embed: req.relations, filters: req.filters })
      .then(announcementCollection => res.json(announcementCollection.toJSON()))
      .catch(err => res.status(400).json({ message: err.message }));
  },
};

module.exports = announcements;
