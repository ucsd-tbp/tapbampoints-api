const app = require('../server/app')
const api = require('supertest')(app);
const expect = require('chai').expect;

describe('Users', function() {
  describe('GET /users/:id', function() {
    it('returns the user with the correct info', function(done) {
      api.get('/api/users/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, {
          id: 1,
          email: null,
          password: null,
          first_name: 'Test',
          last_name: 'User',
          barcode_hash: 'hash',
          house: 'Green',
          member_status: 'Member',
          events: [],
        }, done);
    });

    it('responds with a 404 Not Found when trying to get a nonexistent user', function(done) {
      api.get('/api/users/100')
        .expect(404, done);
    });
  });

  describe('POST /users', function() {
    it('creates a new user with a 201 Created', function(done) {
      api.post('/api/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .send({
          first_name: 'New',
          last_name: 'User',
          barcode_hash: 'hash',
          house: 'Red',
          member_status: 'Initiate',
        })
        .expect(201, {
          id: 2,
          first_name: 'New',
          last_name: 'User',
          barcode_hash: 'hash',
          house: 'Red',
          member_status: 'Initiate',
        }, done);
    });

    it('saved the new user after creation', function(done) {
      api.get('/api/users/2')
        .expect(200, {
          id: 2,
          email: null,
          password: null,
          first_name: 'New',
          last_name: 'User',
          barcode_hash: 'hash',
          house: 'Red',
          member_status: 'Initiate',
          events: [],
        }, done);
    });
  });

  describe('PATCH /users/:id', function() {
    it('updates the user\'s first and last names', function(done) {
      api.patch('/api/users/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .send({ first_name: 'Updated', last_name: 'Name' })
        .expect({ first_name: 'Updated', last_name: 'Name' }, done);
    });

    it('responds with a 404 Not Found when trying to update a nonexistent user', function(done) {
      api.patch('/api/users/10')
        .send({ first_name: 'NonexistentUserName' })
        .expect(404, done)
    });
  });

  describe('DELETE /users/:id', function() {
    it('responds with a 204 No Content', function(done) {
      api.get('/api/users/2')
        .expect(200);
      api.delete('/api/users/2')
        .expect(204, {}, done);
    });

    it('deleted the user', function(done) {
      api.get('/api/users/2')
        .expect(404, { error: 'User not found.' }, done);
    });

    it('responds with a 404 Not Found when trying to delete a nonexistent user', function(done) {
      api.delete('/api/users/2')
        .expect(404, { error: 'No records were deleted.' }, done);
    });
  });
});
