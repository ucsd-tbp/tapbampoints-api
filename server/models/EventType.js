/**
 * @file Defines EventType model. Used to specify point types of events, e.g.
 * academic, social, community service or outreach, and wilcard event types.
 */

const db = require('../database');

const EventType = db.model('EventType', {
  tableName: 'event_types',
  fillable: ['name', 'description'],

  /**
   * Creates one-to-many relation between event types and events.
   *
   * @return {Collection<Event>} Events associated with this event type.
   */
  events() {
    return this.hasMany('Event', 'type_id');
  },
});

module.exports = EventType;
