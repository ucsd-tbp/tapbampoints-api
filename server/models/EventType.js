const db = require('../database');

// Defines EventType model. Used to specify point types of events, e.g.
// academic, social, community service or outreach, and wildcard.
const EventType = db.model('EventType', {
  tableName: 'event_types',

  hidden: ['id'],

  fillable: ['name', 'description'],

  /**
   * Creates one-to-many relation between event types and events.
   * @return {Collection<Event>} Events associated with this event type.
   */
  events() {
    return this.hasMany('Event');
  },
});

// Loads EventType model into Bookshelf registry.
module.exports = EventType;
