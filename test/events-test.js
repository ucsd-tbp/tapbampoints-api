const request = require('supertest')(`http://localhost:${process.env.PORT}`);
const should = require('chai').should();

describe('Events', function() {
  describe('GET /api/events', function() {
    it('should return a list of events');
  });

  describe('GET /api/events/:id', function() {
    it('should respond with a 200 OK')
    it('should return the event with the correct ID');
    it('should respond with a 404 NOT FOUND');
    it('should return a list of users that have attended this event');
  });

  describe('PATCH /api/events/:id', function() {
    it('should respond with a 200 OK')
    it('should update the event\'s title and description');
    it('should update the event\'s type')
  });
});
