/**
 * @file Sets up all API routes by setting up request validation middleware and
 * user permissions specific to each route.
 *
 * Each route is of the format:
 *
 * router.method('uri', validator, permissionCheck, controllerAction)
 *
 * where validator is used to validate the fields of the incoming request,
 * permissionCheck is a set of middleware that first authenticates and
 * authorizes the user, and controllerAction is the route logic that fires
 * only after validation, authentication, and authorization.
 */

const express = require('express');

const controllers = require('../controllers');
const validators = require('../controllers/validators');
const middleware = require('../controllers/middleware');

// TODO Use index.js to export router and define sets of routes and router.use.
const router = express.Router();

// Middleware stack that only allows logged-in admins.
const requireAdmin = [
  controllers.auth.verify,
  middleware.acl.allow(['admin']),
];

// Middleware stack that requires the logged-in user ID and param ID to match.
const requireOwner = [
  controllers.auth.verify,
  middleware.acl.allow(['owner']),
];

// Authentication routes.
router.post('/auth/register', validators.auth.register, controllers.auth.register);
router.post('/auth/login', validators.auth.login, controllers.auth.login);
router.get('/auth/me', controllers.auth.verify, controllers.auth.currentUser);

// Other user routes.
router.get('/users', controllers.users.index);
router.get('/users/:id', controllers.users.show);
router.patch('/users/:id', validators.users.update, requireOwner, controllers.users.update);
router.delete('/users/:id', requireAdmin, controllers.users.delete);

// Event type routes.
router.get('/event-types', controllers.eventTypes.index);
router.get('/event-types/:id', controllers.eventTypes.show);

// Event routes.
router.get('/events', controllers.events.index);
router.get('/events/:id', controllers.events.show);
router.post('/events', validators.events.create, requireAdmin, controllers.events.create);
router.patch('/events/:id', validators.events.update, requireAdmin, controllers.events.update);
router.delete('/events/:id', requireAdmin, controllers.events.delete);

module.exports = router;
