/** @file Defines custom errors returned from routes. */

const constants = require('./constants');

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

function UnauthorizedError(message) {
  this.name = 'UnauthorizedError';
  this.message = message || 'Not authorized to make this request.';
  Error.captureStackTrace(this, UnauthorizedError);
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

function MalformedRequestError(message) {
  this.name = 'MalformedRequestError';
  this.message = message || 'Request is malformed.';
  Error.captureStackTrace(this, MalformedRequestError);
}

MalformedRequestError.prototype = Object.create(Error.prototype);
MalformedRequestError.prototype.constructor = MalformedRequestError;

function InternalServerError(message) {
  this.name = 'InternalServerError';
  this.message = message || constants.GENERIC_ERROR_MESSAGE;
  Error.captureStackTrace(this, InternalServerError);
}

InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.constructor = InternalServerError;

module.exports = {
  InternalServerError,
  MalformedRequestError,
  ResourceNotFoundError,
  ResourceNotUpdatedError,
  UnauthorizedError,
};
