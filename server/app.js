/**
 * @file Initializes application by creating the Express application, loading
 * middleware, and mounts API routes at /api.
 */

// Exposes environment variables in ../.env.
require('dotenv').config();

const bodyParser = require('body-parser');
const compression = require('compression');
const debug = require('debug')('tbp:app');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const validator = require('express-validator');

const middleware = require('./controllers/middleware');
const routes = require('./routes');
const validators = require('./controllers/validators');

const app = express();

debug('registering security, compression, body parsing, custom middleware, and routes');

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

// Mounts API routes onto the base URL /api.
app.use('/', routes);

// If nothing else responded, then returns a 404.
app.use((req, res) => res.status(404).json({ error: 'Endpoint doesn\'t exist.' }));

module.exports = app;
