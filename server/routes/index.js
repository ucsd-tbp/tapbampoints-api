const express = require('express');
const users = require('../controllers/users');

const router = express.Router();

// TODO Use index.js to export router and define API routes in ./api.js.
router.get('/users/:id', users.show);

// TODO Add JWT authentication middleware.

module.exports = router;
