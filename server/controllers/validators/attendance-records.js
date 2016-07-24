/** @file Request validation on routes for attendance records. */

const debug = require('debug')('tbp:records-validator');

const attendanceRecords = {
  /**
   * Validates PUT requests to /users/:id/events/:id. PUT requests should be
   * idempotent, so all fields of the attendance record are required when
   * creating a new record.
   */
  create(req, res, next) {
    debug('firing attendanceRecords.create validation middleware');

    req.check('points_earned', 'Points earned value must be a number greater than or equal to 0.')
      .isInt({ min: 0 });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },

  /** Validates PATCH requests to /users/:id/events/:id. */
  update(req, res, next) {
    debug('firing attendanceRecords.update validation middleware');

    req.check('points_earned', 'Points earned value must be a number greater than or equal to 0.')
      .optional().isInt({ min: 0 });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },
};

module.exports = attendanceRecords;
