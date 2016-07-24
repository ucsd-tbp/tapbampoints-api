/** @file Request validation for event routes on /events. */

const debug = require('debug')('tbp:events-validator');

const events = {
  /** Validates POST requests to /api/events. */
  create(req, res, next) {
    debug('firing events.create validation middleware');

    req.checkBody({
      name: {
        notEmpty: { errorMessage: 'The event name can\'t be empty.' },
      },

      description: {
        optional: true,
        notEmpty: { errorMessage: 'The description can\'t be empty.' },
      },
    });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },

  /** Validates PATCH requests to /api/events/:id. */
  update(req, res, next) {
    debug('firing events.update validation middleware');

    req.checkBody({
      name: {
        optional: true,
        notEmpty: { errorMessage: 'The event name can\'t be empty.' },
      },

      description: {
        optional: true,
        notEmpty: { errorMessage: 'The description can\'t be empty.' },
      },
    });

    req.check('points', 'Points value must be a number greater than or equal to 0.').optional()
      .isInt({ min: 0 });

    const errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    next();
  },
}

module.exports = events;
