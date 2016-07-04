const request = require('supertest')(`http://localhost:${process.env.PORT}`);
const should = require('chai').should();

describe('Users', function() {
  describe('GET /api/users/:id', function() {
    it('should respond with a 200 OK')
    it('should return the user with the correct ID');
    it('should respond with a 404 NOT FOUND');
    it('should return a list of the user\'s attended events');
  });

  describe('POST /api/users', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 201 CREATED')
    it('should create a new user');
  });

  describe('PATCH /api/users/:id', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 200 OK')
    it('should update the user\'s first and last names');
  });

  describe('DELETE /api/users/:id', function() {
    it('should return a 403 FORBIDDEN without appropriate authentication');
    it('should respond with a 204 NO CONTENT');
    it('should delete the user');
  });
});
