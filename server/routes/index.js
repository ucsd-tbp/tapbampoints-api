const express = require('express');

const controllers = require('../controllers');
const validators = require('../validators');

// TODO Use index.js to export router and define sets of routes and router.use.
const router = express.Router();

const requireAdmin = [
  controllers.auth.verify,
  // TODO Add middleware to allow only admins.
];

// Authentication routes.
router.post('/auth/register', validators.auth.register, controllers.auth.register);
router.post('/auth/login', controllers.auth.login);
router.get('/auth/me', requireAdmin, controllers.auth.currentUser);

// Other user routes.
router.get('/users/:id', controllers.users.show);
router.get('/users', controllers.users.index);
router.patch('/users/:id', validators.users.update, requireAdmin, controllers.users.update);
router.delete('/users/:id', requireAdmin, controllers.users.delete);

// Event type routes.
router.get('/event-types', controllers.eventTypes.index);

// Event routes.
router.get('/events/:id', controllers.events.show);

module.exports = router;
