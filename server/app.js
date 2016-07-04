const express = require('express');
const routes = require('./routes');

// Sets up .env configuration file and initializes application.
const app = express();

// Registers middleware.
// TODO Add logging and body parsing middleware.

// Sets up API routes.
app.use('/api', routes);

module.exports = app;
