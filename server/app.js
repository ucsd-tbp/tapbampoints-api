/**
 * @file Initializes application by creating the Express application, loading
 * middleware, and mounts API routes at /api.
 */

// Exposes environment variables in ../.env.
require('dotenv').config();

const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const debug = require('debug')('tbp:app');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const validator = require('express-validator');

const middleware = require('./controllers/middleware');
const routes = require('./routes');
const validators = require('./controllers/validators');

const errors = require('./modules/errors');
const constants = require('./modules/constants');

// TODO Prevent SQL from being bubbled up as an error message.
const app = express();

debug('registering security, compression, body parsing, custom middleware, and routes');

// Enables all CORS requests.
app.use(cors());

// Adds some security by adding HTTP headers.
app.use(helmet());

// Adds gzip compression to all requests.
app.use(compression());

// HTTP request logging middleware for development.
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Places request body in req.body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allows for validation on the request object.
app.use(validator({ customValidators: validators.custom }));

// Custom API middleware.
app.use(middleware.embed);
app.use(middleware.filters);

// Mounts API routes onto the base URL /api.
app.use('/', routes);

// If nothing else responded, then returns a 404.
app.use((req, res) => res.status(404).json({ error: 'Endpoint doesn\'t exist.' }));

// Global error handler.
app.use((error, req, res, next) => {
  debug(`reached global error handler with error message: ${error.message}`);

  switch (error.constructor) {
    case errors.ResourceNotFoundError:
      res.status(404).send({ message: error.message });
      break;
    case errors.ResourceNotUpdatedError:
      res.status(304).send({ message: error.message });
      break;
    default:
      res.status(500).send({ message: errors.GENERIC_ERROR_MESSAGE });
  }

  next();
});

module.exports = app;
