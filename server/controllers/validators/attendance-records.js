/** @file Request validation on routes for attendance records. */

const debug = require('debug')('tbp:records-validator');

const Event = require('../../models/Event');
const User = require('../../models/User');

const attendanceRecords = {
  /**
   * Validates PUT requests to /users/:id/events/:id. PUT requests should be
   * idempotent, so all fields of the attendance record are required when
   * creating a new record. Also used to validate PATCH requests since the only
   * field is `points_earned`.
   */
  createOrUpdate(req, res, next) {
    debug('firing attendanceRecords.create validation middleware');

    req.checkBody('points_earned', 'Number of points should be greater than or equal to 0.')
      .isNotNegative();

    req.checkBody('points_earned', 'Number of points should be a multiple of 0.25.')
      .isValidPointValue();

    req.checkParams('event_id', 'Can\'t register user; this event doesn\'t exist.')
      .exists('id', Event);

    req.checkParams('user_id', 'Can\'t register user; this user doesn\'t exist.')
      .exists('id', User);

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },
};

module.exports = attendanceRecords;
