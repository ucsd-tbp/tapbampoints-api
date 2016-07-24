/**
 * @file Initializes application by creating the Express application, loading
 * middleware, and mounts API routes at /api.
 */

// Exposes environment variables in ../.env.
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const debug = require('debug')('tbp:app');

const routes = require('./routes');
const validators = require('./controllers/validators');
const middleware = require('./controllers/middleware');

const app = express();


debug('registering body-parser and express-validator middleware');

// HTTP request logging middleware.
app.use(morgan('dev'));

// Places request body in req.body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allows for validation on the request object.
app.use(validator({ customValidators: validators.custom }));

// TODO Add compression middleware (and helmet for production)

// Custom API middleware.
app.use(middleware.embed);

// Mounts API routes onto the base URL /api.
app.use('/api', routes);

module.exports = app;
