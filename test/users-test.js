const expect = require('chai').expect;

const app = require('../server/app')
const api = require('supertest')(app);

const { migrateWithTestUser, rollback } = require('./helpers');

describe('Users', function() {
  before(migrateWithTestUser);
  after(rollback);

  describe('GET /users/:id', function() {
    it('returns the user with the correct info', function(done) {
      api.get('/api/users/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, {
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
          house: 'None',
          member_status: 'Initiate',
          events: [],
        }, done);
    });

    it('responds with a 404 Not Found when trying to get a nonexistent user', function(done) {
      api.get('/api/users/100')
        .expect(404, {
          error: 'User not found.',
        }, done);
    });
  });

  describe('PATCH /users/:id', function() {
    let token = null;

    before(function(done) {
      api.post('/api/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
    });

    it('updates the user\'s first and last names when logged in', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', last_name: 'Name' })
        .expect({ first_name: 'Updated', last_name: 'Name' }, done);
    });

    it('responds with a 404 Not Found when trying to update a nonexistent user', function(done) {
      api.patch('/api/users/10')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'NonexistentUserName' })
        .expect(404, done);
    });
  });

  describe.skip('DELETE /users/:id', function() {
    it('responds with 401 Unauthorized ')

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
