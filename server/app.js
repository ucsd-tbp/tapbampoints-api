/**
 * @file Initializes application by creating the Express application, loading
 * middleware, and mounts API routes at /api.
 */

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO Add logging middleware.

app.use('/api', routes);

module.exports = app;
