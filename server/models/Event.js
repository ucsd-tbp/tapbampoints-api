/** @file Defines Event model. */

require('./User');
require('./AttendanceRecord');

const db = require('../database');
const EventType = require('./EventType');

const Event = db.model('Event', {
  tableName: 'events',
  hidden: ['type_id', 'officer_id'],
  fillable: [
    'summary', 'description', 'location', 'points', 'start', 'end',
  ],

  relationships: {
    /** Officer chairing this event. */
    officer() {
      return this.belongsTo('User', 'officer_id');
    },

    /** Attendees confirmed to be at event. */
    attendees() {
      return this.belongsToMany('User', 'attendance_records');
    },

    /** Type of this event, i.e. 'academic', 'social', 'service'. */
    type() {
      return this.belongsTo('EventType', 'type_id');
    },
  },

  initialize() {
    this.on('saving', this.convertTypeToID);
  },

  convertTypeToID() {
    if (!hasOwnProperty.call(this.attributes, 'type')) return;

    return EventType.where('name', this.attributes.type).fetch({ require: true })
      .then((type) => {
        // Replaces `role` property with `role_id`.
        delete this.attributes.type;
        this.set('type_id', type.id);
      });
  },
});

module.exports = Event;
