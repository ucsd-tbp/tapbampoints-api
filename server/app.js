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

const find = require('lodash/find');
const errors = require('./modules/errors');

const app = express();

debug('registering security, compression, body parsing, custom middleware, and routes');

// Authorization header in response contains JWT for client to use.
app.use(cors({ origin: process.env.CLIENT_ADDRESS, exposedHeaders: 'Authorization' }));

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

// Index route dynamically lists all registered routes on the API.
app.get('/', (req, res) => {
  const stack = find(app._router.stack, (layer) => layer.name === 'router').handle.stack;
  const paths = stack.map((layer) => layer.route.path);
  res.status(200).send({ endpoints: paths });
});

// If nothing else responded, then returns a 404.
app.use((req, res) => res.status(404).json({ error: 'Endpoint doesn\'t exist.' }));

// Global error handler.
app.use((error, req, res, next) => {
  debug(error);

  let statusCode;

  // Handles returning the appropriate status code according to exception.
  switch (error.constructor) {
    case errors.ResourceNotUpdatedError:
      statusCode = 304;
      break;
    case errors.MalformedRequestError:
      statusCode = 400;
      break;
    case errors.NotVerifiedError:
      statusCode = 200;
      break;
    case errors.UnauthorizedError:
      statusCode = 401;
      break;
    case errors.ResourceNotFoundError:
      statusCode = 404;
      break;
    default:
      statusCode = 500;
  }

  res.status(statusCode).send({ message: error.message });
  next();
});

module.exports = app;
