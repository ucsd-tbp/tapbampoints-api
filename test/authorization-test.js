const request = require('supertest')(`http://localhost:${process.env.PORT}/api`);
const should = require('chai').should();

describe('Authorization', function() {
  describe('POST /auth/login', function() {
    it('returns 401 UNAUTHORIZED with invalid credentials');
    it('returns a JWT with valid credentials');
  });

  describe('POST /auth/register', function() {
    it('creates a new user');
    it('returns a JWT corresponding to newly created user');
  })

  describe('GET /auth/me', function() {
    it('returns the currently logged in user with a valid token');
  })

  describe('GET /auth/validate_token', function() {
    it('returns a 200 OK with a valid token');
  });
});
