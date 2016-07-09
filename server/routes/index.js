const express = require('express');

const users = require('../controllers/users');
const eventTypes = require('../controllers/event-types');
const events = require('../controllers/events');
const auth = require('../controllers/authentication');

// TODO Use index.js to export router and define sets of routes and router.use.
const router = express.Router();

const requireAdmin = [
  auth.validate,
  // TODO Add middleware to allow only admins.
];

// TODO Use express-validator for request validation.

// Authentication routes.
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', auth.validate, auth.currentUser);

// Other user routes.
router.get('/users/:id', users.show);
router.get('/users', users.index);
router.patch('/users/:id', requireAdmin, users.update);
router.delete('/users/:id', requireAdmin, users.delete);

// Event type routes.
router.get('/event-types', eventTypes.index);

// Event routes.
router.get('/events/:id', events.show);

module.exports = router;
