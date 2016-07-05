const express = require('express');

const users = require('../controllers/users');
const eventTypes = require('../controllers/event-types');
const events = require('../controllers/events');

// TODO Use index.js to export router and define API routes in ./api.js.
// TODO Add JWT authentication middleware.
const router = express.Router();

// User routes.
router.get('/users/:id', users.show);
router.get('/users', users.index);
router.post('/users', users.create);
router.patch('/users/:id', users.update);
router.delete('/users/:id', users.delete);

// Event type routes.
router.get('/event-types', eventTypes.index);

// Event routes.
router.get('/events/:id', events.show);

module.exports = router;
