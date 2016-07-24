/** @file Contains endpoints for routes related to attendance records. */

const User = require('../models/User');

// TODO Refactor controllers to use error codes to avoid extra queries.
const attendanceRecords = {
  /**
   * Creates an attendance record given a user ID (attendee) and an event ID
   * (the event that the user attended).
   */
  create(req, res) {
    User.where('id', req.params.user_id)
      .fetch({ require: true })
      .then(user => {
        // Creates a new attendance record given the user signing in and the
        // event to sign in to.
        user.attended_events().attach({
          user_id: req.params.user_id,
          event_id: req.params.event_id,
          points_earned: req.body.points_earned,
        })
          .then(collection => res.json(collection.toJSON()))
          .catch(err => {
            let message;

            // Handles errors associated with inserting an attendance record.
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
      })
      .catch(User.NotFoundError, () => res.status(404).json({ error: 'User not found.' }))
      .catch(err => res.status(400).json({ error: err.message }));
  },
};

module.exports = attendanceRecords;
