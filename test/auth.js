const expect = require('chai').expect;

const app = require('../server/app')
const api = require('supertest')(app);

const { migrateWithTestUser, rollback } = require('./helpers');

describe('Authentication', function() {
  describe('token verification middleware', function() {
    before(migrateWithTestUser);
    after(rollback);

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
      let token = null;

      api.post('/api/auth/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .end(function(err, res) {
          token = res.body.token;

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
  });


  describe('POST /auth/register', function() {
    beforeEach(migrateWithTestUser);
    afterEach(rollback);

    it('returns a 400 Bad Request if the email is formatted incorrectly', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'incorrectemail',
          password: 'password',
          barcode: 'barcode',
          house: 'Red',
          member_status: 'Member',
        })
        .expect(400, [{
          param: 'email',
          msg: 'Email is invalid.',
          value: 'incorrectemail',
        }], done);
    });

    it('returns a 400 Bad Request if the password is less than 4 characters', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'Short',
          last_name: 'Password',
          email: 'shortpassword@test.com',
          password: 'pas',
          barcode: 'barcode',
        })
        .expect(400, [{
          param: 'password',
          msg: 'Password must be at least 4 characters.',
          value: 'pas',
        }], done);
    });

    it('returns a 400 Bad Request if an email exists without a password', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'No',
          last_name: 'Password',
          email: 'nopassword@test.com',
          barcode: 'barcode',
        })
        .expect(400, [{
          msg: 'Password must be at least 4 characters.',
          param: 'password',
        }], done);
    });

    it('returns a 400 Bad Request if a password exists without an email', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'No',
          last_name: 'Email',
          password: 'noemail',
          barcode: 'barcode',
        })
        .expect(400, [{
          msg: 'Email is invalid.',
          param: 'email',
        }], done);
    });

    it('returns a 400 Bad Request if the barcode was not provided', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@test.com',
          password: 'password',
          house: 'Red',
          member_status: 'Member',
        })
        .expect(400, [{
          param: 'barcode',
          msg: 'The barcode from an ID card is required.',
        }], done);
    });

    it('responds with a token and a 201 Created given an email, password, and barcode', function(done) {
      api.post('/api/auth/register')
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

    it('responds with a token and a 201 Created with just the barcode', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User with just barcode',
          barcode: 'barcode',
          house: 'Blue',
        })
        .expect(201, function(err, res) {
          expect(res.body.token).to.exist;

          api.get('/api/users/2')
            .expect(200, {
              first_name: 'New',
              last_name: 'User with just barcode',
              email: null,
              house: 'Blue',
              member_status: 'Initiate',
              events: [],
            }, done);
        });
    });

    it.skip('returns a 400 Bad Request if a user with a duplicate email is registered', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'Unique',
          last_name: 'User',
          email: 'uniqueuser@test.com',
          password: 'password',
          barcode: 'firstbarcode',
        })
        .expect(201);
      api.post('/api/auth/register')
        .send({
          first_name: 'Duplicate',
          last_name: 'User',
          email: 'uniqueuser@test.com',
          password: 'password',
          barcode: 'secondbarcode',
        })
        .expect(400, done);
    });

    it('returns a 400 Bad Request if a user with a duplicate barcode is registered');
  });

  describe.skip('POST /auth/login', function() {
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
});
