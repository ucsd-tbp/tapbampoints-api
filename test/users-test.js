const app = require('../server/app')
const api = require('supertest')(app);
const expect = require('chai').expect;

describe('Users', function() {
  describe('GET /users/:id', function() {
    it('returns the user with the correct ID', function(done) {
      api.get('/api/users/1')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('responds with a 404 Not Found with a nonexistent ID', function(done) {
      api.get('/api/users/100')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('returns a list of the user\'s attended events');
  });

  describe('POST /users', function() {
    it('creates a new user with a 201 Created', function(done) {
      api.post('/api/users')
        .send({
          first_name: 'New',
          last_name: 'User',
          barcode_hash: 'hash',
          house: 'Red',
          member_status: 'Initiate',
        })
        .expect(200, { first_name: 'New', last_name: 'User' }, done);
    });
  });

  describe('PATCH /users/:id', function() {
    it('responds with a 404 Not Found with a nonexistent ID');
    it('updates the user\'s first and last names');
  });

  describe('DELETE /users/:id', function() {
    it('responds with a 204 No Content');
    it('deletes the user');
  });
});
