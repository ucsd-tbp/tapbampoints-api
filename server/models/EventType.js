const db = require('../database');

// Defines EventType model. Used to specify point types of events, e.g.
// academic, social, community service or outreach, and wildcard.
const EventType = db.model('EventType', {
  tableName: 'event_types',
});

// Loads EventType model into Bookshelf registry.
module.exports = EventType;
