/** @file Defines custom errors returned from routes. */

const constants = require('./constants');

/**
 * Indicates that a resource was not found to return a 404.
 * @param {string} message Custom error message.
 */
function ResourceNotFoundError(message) {
  this.name = 'ResourceNotFoundError';
  this.message = message || 'Resource not found.';
  Error.captureStackTrace(this, ResourceNotFoundError);
}

ResourceNotFoundError.prototype = Object.create(Error.prototype);
ResourceNotFoundError.prototype.constructor = ResourceNotFoundError;

function ResourceNotUpdatedError(message) {
  this.name = 'ResourceNotUpdatedError';
  this.message = message || 'Resource was not updated.';
  Error.captureStackTrace(this, ResourceNotUpdatedError);
}

ResourceNotUpdatedError.prototype = Object.create(Error.prototype);
ResourceNotUpdatedError.prototype.constructor = ResourceNotUpdatedError;

function InternalServerError(message) {
  this.name = 'InternalServerError';
  this.message =  message || constants.GENERIC_ERROR_MESSAGE;
  Error.captureStackTrace(this, InternalServerError);
}

InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.constructor = InternalServerError;

module.exports = {
  ResourceNotFoundError,
  ResourceNotUpdatedError,
  InternalServerError,
};
