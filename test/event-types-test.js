const request = require('supertest')(`http://localhost:${process.env.PORT}`);
const should = require('chai').should();

describe('Event Types', function() {
  describe('GET /api/event-types', function() {
    it('should return a list of event types');
  });

  describe('GET /api/event-types/:id', function() {
    it('should respond with a 200 OK')
    it('should return the event type with the correct ID');
    it('should respond with a 404 NOT FOUND');
  });

  describe('POST /api/event-types', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 201 CREATED')
    it('should create a new event-type');
  });

  describe('PATCH /api/event-types/:id', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 200 OK')
    it('should update the event-type\'s name and description');
  });

  describe('DELETE /api/event-types/:id', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 204 NO CONTENT');
    it('should delete the event-type');
  });
});
