/** @file Contains endpoints for routes related to attendance records. */

const format = require('date-fns/format');
const constants = require('../modules/constants');

const db = require('../database');
const AttendanceRecord = require('../models/AttendanceRecord');
const Event = require('../models/Event');
const User = require('../models/User');

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
        // TODO Move validation to validators -- should not be in controllers.
        switch (err.code) {
          // Checks if adding the record failed because of a duplicate
          // insertion, since `user_id` and `event_id` pairs are enforced
          // to be unique.
          case 'ER_DUP_ENTRY':
            message = 'You have already signed into the event.';
            break;

          default:
            message = 'An error occurred when making the attendance record';
        }

        return res.status(400).json({ message });
      });
  },

  /**
   * Lists all attendance records. If called with an authenticated user in the
   * request (i.e. user in `req.user` from decoded JWT) then shows the
   * attendance records of the authenticated user.
   */
  index(req, res) {
    new AttendanceRecord().findAll({ embed: req.relations, filters: req.filters })
      .then(records => res.json(records.toJSON()))
      .catch(err => res.status(400).json({ message: err.message }));
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

  /**
   * Finds the number of points that a user received in each event category,
   * along with the number of events that user attended in each category.
   * Requires user PID in the request parameters. Includes event categories that
   * the user has no points in.
   *
   * @example
   *
   * GET /records/points?pid=A12345678
   *
   * {
   *   academic: { num_events: 1, total: 7 },
   *   social: { num_events: 2, total: 9 },
   *   service: { num_events: 0, total: 0 },
   *   wildcard: { num_events: 0, total: 0 },
   * }
   *
   */
  currentPoints(req, res) {
    if (!req.query.pid) {
      res.status(400).json({ error: 'PID is required.' });
    }

    const lowerDateTimeISO = req.query.timeMin || constants.EPOCH_ISO_DATETIME;
    const upperDateTimeISO = req.query.timeMax || (new Date()).toISOString();

    const sqlQuery = `
      SELECT
        event_types.name AS type,
        COUNT(records.event_id) AS num_events,
        SUM(CASE WHEN records.points_earned IS NULL THEN 0 ELSE records.points_earned END) AS total
      FROM attendance_records records
      INNER JOIN events
        ON records.event_id = events.id
      INNER JOIN users
        ON records.user_id = users.id AND users.pid = (?)
      RIGHT OUTER JOIN event_types
        ON events.type_id = event_types.id
          AND records.created_at BETWEEN (?) AND (?)
      GROUP BY event_types.name;
    `;

    db.knex.raw(sqlQuery, [
      req.query.pid,
      format(lowerDateTimeISO, constants.DATABASE_DATE_FORMAT),
      format(upperDateTimeISO, constants.DATABASE_DATE_FORMAT),
    ])
      .then(data => res.json(data[0]))
      .catch(err => res.status(400).json({ error: err.message }));
  },
};

module.exports = attendanceRecords;
