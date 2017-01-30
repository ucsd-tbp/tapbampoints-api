/** @file Request validation for event routes on /events. */

const debug = require('debug')('tbp:events-validator');
const EventTypes = require('../../modules/constants').EventTypes;

const events = {
  /** Validates POST requests to /api/events. */
  create(req, res, next) {
    debug('firing events.create validation middleware');

    req.checkBody('summary', 'The event summary can\'t be empty.').notEmpty();

    req.checkBody('type', 'The event must be given a type.').notEmpty();
    req.checkBody('type', 'Event type must be one of academic, social, service, or wildcard.')
      .isIn([EventTypes.ACADEMIC, EventTypes.SOCIAL, EventTypes.SERVICE, EventTypes.WILDCARD]);

    req.checkBody('start', 'Start time must be given.').notEmpty();
    req.checkBody('end', 'End time must be given.').notEmpty();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },

  /** Validates PATCH requests to /api/events/:id. */
  update(req, res, next) {
    debug('firing events.update validation middleware');

    req.checkBody('summary', 'The event summary can\'t be empty.').optional().notEmpty();
    req.check('points', 'Points value must be a number greater than or equal to 0.').optional()
      .isInt({ min: 0 });

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      next();
    });
  },
};

module.exports = events;
