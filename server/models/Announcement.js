/** @file Defines Announcement model. */

const db = require('../database');

const Announcement = db.model('Announcement', {
  tableName: 'announcements',
  fillable: ['summary, description'],
});

module.exports = Announcement;
