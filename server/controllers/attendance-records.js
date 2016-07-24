/** @file Contains endpoints for routes related to attendance records. */

const debug = require('debug')('tbp:users-controller');

const User = require('../models/User');
const Event = require('../models/Event');

const attendanceRecords = {
  /**
   * Creates an attendance record given a user ID (attendee) and an event ID
   * (the event that the user attended).
   */
  create(req, res) {
    // Creates a new attendance record given the user signing in and the
    // event to sign in to.
    new User({ id: req.params.user_id }).attended_events().attach({
      user_id: req.params.user_id,
      event_id: req.params.event_id,
      points_earned: req.body.points_earned,
    })
      .then(collection => res.json(collection.toJSON()))
      .catch(err => {
        let message;

        // Handles errors associated with inserting an attendance record.
        // REVIEW Error codes versus prior validation middleware.
        switch (err.code) {
          // Checks if adding the record failed because of a duplicate
          // insertion, since `user_id` and `event_id` pairs are enforced
          // to be unique.
          case 'ER_DUP_ENTRY':
            message = 'You have already signed into the event.';
            break;

          // If a foreign key constraint fails, then the corresponding ID
          // row in one of the tables does not exist.
          case 'ER_NO_REFERENCED_ROW_2':
            message = 'The user or event doesn\'t exist.';
            break;

          default:
            message = 'An error occurred when making the attendance record';
        }

        return res.status(400).json({ error: message });
      });
  },

  /** Lists events that a user has attended. */
  showAttendedEvents(req, res) {
    new User({ id: req.params.id })
      .fetch({ withRelated: ['attended_events'], require: true })
      .then(user => user.attended_events().fetch({ withRelated: req.relations }))
      .then(events => res.json(events.toJSON()))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Lists users that attended an event. */
  showAttendees(req, res) {
    new Event({ id: req.params.id })
      .fetch({ withRelated: ['attendees'], require: true })
      .then(event => event.attendees().fetch({ withRelated: req.relations }))
      .then(attendees => res.json(attendees.toJSON()))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Updates an attendance record. */
  update(req, res) {
    new User({ id: req.params.user_id }).attended_events().updatePivot({
      user_id: req.params.user_id,
      event_id: req.params.event_id,
      points_earned: req.body.points_earned,
    })
      .then(collection => res.json(collection.toJSON()))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /** Deletes an attendance record. */
  delete(req, res) {
    new User({ id: req.params.user_id }).attended_events().detach([
      req.params.user_id,
      req.params.event_id,
    ])
      .then(() => res.send(204))
      .catch(err => res.status(400).json({ error: err.message }));
  },
};

module.exports = attendanceRecords;
