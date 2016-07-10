
const knex = require('../server/database').knex;
const config = { directory: 'server/database/migrations' };

const app = require('../server/app')
const api = require('supertest')(app);
const expect = require('chai').expect;
const bcrypt = require('bcrypt');

describe('Users', function() {
  before('migrates test database and creates a user', function(done) {
    return knex.migrate.latest(config)
      .then(() => {
        return knex('users').insert({
          id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@test.com',
          password: bcrypt.hashSync('password', 0),
          barcode: bcrypt.hashSync('barcode', 0),
        });
      })
      .then(() => done());
  });

  after('rolls back test database', function(done) {
    knex.migrate.rollback(config)
      .then(() => done());
  });

  describe('/auth middleware', function() {
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

    it('returns a 401 Unauthorized without an Authorization header', function(done) {
      api.get('/api/auth/me')
        .expect(401, { error: 'Authorization header not present.' }, done);
    });

    it('returns a 400 Bad Request with missing authentication scheme', function(done) {
      api.get('/api/auth/me')
        .set('Authorization', 'Token')
        .expect(400, {
          error: 'Incorrect authentication scheme. Required format: "Authorization: Bearer {token}".',
        }, done);
    });

    it('returns the currently logged in user with a valid token', function(done) {
      api.get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, {
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
          house: 'None',
          member_status: 'Initiate',
          events: [],
        }, done);
    });
  });


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
        }, done)
    });
  });

  describe('POST /auth/register', function() {
    it('returns a 400 Bad Request if an email exists without a password');
    it('returns a 400 Bad Request if a password exists without an email');
    it('returns a 400 Bad Request if an email and password pair exists but not a barcode');
    it('returns a 422 Unprocessable Entity if the email is formatted incorrectly');

    it('responds with a token and a 201 Created with valid input', function(done) {
      api.post('/api/auth/register')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@test.com',
          password: 'password',
          barcode: 'barcode',
          house: 'Red',
          member_status: 'Member',
        })
        .expect(201, function(err, res) {
          expect(res.body.token).to.exist;
          done();
        });
    });

    it('created a new user', function(done) {
      api.get('/api/users/2')
        .expect(200, {
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@test.com',
          house: 'Red',
          member_status: 'Member',
          events: [],
        }, done);
    });
  });

  describe('POST /auth/login', function() {
    it('returns a 400 Bad Request a registered user tries to login with a barcode');
    it('returns a 400 Bad Request if an email, password, and barcode are all provided');

    it('returns a 401 Unauthorized if the password was incorrect', function(done) {
      api.post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' })
        .expect(401, { error: 'Password did not match.' }, done);
    });

    it('returns a 401 Unauthorized if a user with the given email does not exist', function(done) {
      api.post('/api/auth/login')
        .send({ email: 'nonexistentuser@test.com', password: 'password' })
        .expect(401, { error: 'Couldn\'t find a user with the given email.' }, done);
    });

    it('returns a 200 OK when logging in with valid credentials', function(done) {
      api.post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200, function(err, res) {
          expect(res.body.token).to.exist;
          done();
        });
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
