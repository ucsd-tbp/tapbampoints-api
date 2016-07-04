const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

// Sets up .env configuration file and initializes application.
const app = express();

// Adds support for parsing JSON and urlencoded bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO Add logging middleware.

// Sets up API routes.
app.use('/api', routes);

module.exports = app;
