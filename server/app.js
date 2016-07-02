const dotenv = require('dotenv');
const express = require('express');
const router = require('./routes/index');

// Sets up environment file as early as possible.
dotenv.config();

// Sets up .env configuration file and initializes application.
const app = express();

// Registers middleware.
// TODO Add logging and body parsing middleware.

// Sets up routes.
app.use('/api', router);

module.exports = app;
