const expect = require('chai').expect;

const app = require('../server/app');
const api = require('supertest')(app);

const { helpers, queries } = require('./helpers');

describe('Authentication', function() {
  describe('token verification middleware', function() {
    before('inserts a regular and admin user into the database', function(done) {
      return helpers.migrateWithQueries(queries.users).then(() => done());
    });

    after(helpers.rollback);

    it('returns a 401 Unauthorized without an Authorization header', function(done) {
      api.get('/auth/me')
        .expect(401, { error: 'Authorization header not present.' }, done);
    });

    it('returns a 400 Bad Request with missing authentication scheme', function(done) {
      api.get('/auth/me')
        .set('Authorization', 'Token')
        .expect(400, {
          error: 'Incorrect authentication scheme. ' +
                 'Required format: "Authorization: Bearer {token}".',
        }, done);
    });

    it('returns a token when logging in a registered user with a valid email and password',
      function(done) {
        let token = null;

        api.post('/auth/login')
          .send({
            email: 'test@test.com',
            password: 'password',
          })
          .end(function(err, res) {
            token = res.body.token;

            api.get('/auth/me')
              .set('Authorization', `Bearer ${token}`)
              .expect(200, {
                id: 1,
                email: 'test@test.com',
                first_name: 'Test',
                last_name: 'User',
                house: 'none',
                member_status: 'Initiate',
              }, done);
          });
      });
  });

  describe('POST /auth/register', function() {
    before('inserts a regular and admin user into the database', function(done) {
      return helpers.migrateWithQueries(queries.users).then(() => done());
    });

    after(helpers.rollback);

    it('returns a 400 Bad Request if the email is formatted incorrectly', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'incorrectemail',
          password: 'password',
          pid: 'pid',
          house: 'red',
          member_status: 'Member',
        })
        .expect(400, [{
          param: 'email',
          msg: 'Email is invalid.',
          value: 'incorrectemail',
        }], done);
    });

    it('returns a 400 Bad Request if the password is less than 4 characters', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'Short',
          last_name: 'Password',
          email: 'shortpassword@test.com',
          password: 'pas',
          pid: 'pid',
        })
        .expect(400, [{
          param: 'password',
          msg: 'Password must be at least 4 characters.',
          value: 'pas',
        }], done);
    });

    it('returns a 400 Bad Request if an email exists without a password', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'No',
          last_name: 'Password',
          email: 'nopassword@test.com',
          pid: 'pid',
        })
        .expect(400, [{
          msg: 'Password must be at least 4 characters.',
          param: 'password',
        }], done);
    });

    it('returns a 400 Bad Request if a password exists without an email', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'No',
          last_name: 'Email',
          password: 'noemail',
          pid: 'pid',
        })
        .expect(400, [{
          msg: 'Email is invalid.',
          param: 'email',
        }], done);
    });

    it('returns a 400 Bad Request if the pid was not provided', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User',
          email: 'newuser@test.com',
          password: 'password',
          house: 'red',
          member_status: 'Member',
        })
        .expect(400, [{
          param: 'pid',
          msg: 'The pid from an ID card is required.',
        }], done);
    });

    it('returns a 201 Created and a token given a valid email, password, and pid',
      function(done) {
        api.post('/auth/register')
          .send({
            first_name: 'New',
            last_name: 'User',
            email: 'newuser@test.com',
            password: 'password',
            pid: 'pid2',
            house: 'red',
          })
          .expect(201, function(err, res) {
            expect(res.body.token).to.exist;

            api.get('/users/3')
              .expect(200, {
                id: 3,
                first_name: 'New',
                last_name: 'User',
                email: 'newuser@test.com',
                house: 'red',
                member_status: 'Initiate',
              }, done);
          });
      });

    it('returns a 201 Created when registering with just the pid', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'New',
          last_name: 'User with just pid',
          pid: 'pid3',
          house: 'blue',
        })
        .expect(201, function(err, res) {
          expect(res.body.token).to.exist;

          api.get('/users/4')
            .expect(200, {
              id: 4,
              first_name: 'New',
              last_name: 'User with just pid',
              email: null,
              house: 'blue',
              member_status: 'Initiate',
            }, done);
        });
    });

    it('returns a 400 Bad Request if a user with a duplicate email is registered', function(done) {
      api.post('/auth/register')
        .send({
          first_name: 'Unique',
          last_name: 'User',
          email: 'uniqueuser@test.com',
          password: 'password',
          pid: 'pid4',
        })
        .expect(201, function() {
          api.post('/auth/register')
            .send({
              first_name: 'Duplicate',
              last_name: 'User',
              email: 'uniqueuser@test.com',
              password: 'password',
              pid: 'pid5',
            })
            .expect(400, [{
              param: 'email',
              msg: 'This email has already been registered.',
              value: 'uniqueuser@test.com',
            }], done);
        });
    });

    it('returns a 400 Bad Request if a user with a duplicate pid is registered',
      function(done) {
        api.post('/auth/register')
          .send({
            first_name: 'Unique PID',
            last_name: 'User',
            pid: 'pid2',
          })
          .expect(201, function() {
            api.post('/auth/register')
              .send({
                first_name: 'Duplicate PID',
                last_name: 'User',
                pid: 'pid2',
              })
              .expect(400, [{
                param: 'pid',
                msg: 'This pid has already been registered.',
                value: 'pid2',
              }], done);
          });
      });
  });

  describe('POST /auth/login', function() {
    before('inserts a regular and admin user into the database', function(done) {
      return helpers.migrateWithQueries(queries.users).then(() => done());
    });

    after(helpers.rollback);

    it(`returns a 400 Bad Request when trying to login with email, password, and pid
        all present in request body`,
      function(done) {
        api.post('/auth/login')
          .send({ email: 'test@test.com', password: 'password', pid: 'pid1' })
          .expect(400, {
            error: 'Login is only allowed via pid, or via an email and password combination.',
          }, done);
      });

    it(`returns a 400 Bad Request when trying to login with an email and pid present in request
        body`,
      function(done) {
        api.post('/auth/login')
          .send({ email: 'test@test.com', pid: 'pid1' })
          .expect(400, {
            error: 'Login is only allowed via pid, or via an email and password combination.',
          }, done);
      });

    it(`returns a 400 Bad Request when trying to login with a password and pid present in
        request body`,
      function(done) {
        api.post('/auth/login')
          .send({ password: 'password', pid: 'pid1' })
          .expect(400, {
            error: 'Login is only allowed via pid, or via an email and password combination.',
          }, done);
      });

    it(`returns a 400 Bad Request when trying to login with a pid when a user has a registered
        email and password`, function(done) {
      api.post('/auth/login')
        .send({ pid: 'pid1' })
        .expect(401, {
          error: 'Login via pid is disabled with a registered email and password.',
        }, done);
    });

    it('returns a token when logging in a non-registered user with just the pid',
      function(done) {
        api.post('/auth/register')
          .send({
            first_name: 'New',
            last_name: 'User with just pid',
            pid: 'pid2',
          })
          .expect(201, function(err, res) {
            expect(res.body.token).to.exist;

            api.post('/auth/login')
              .send({ pid: 'pid2' })
              .expect(200, function(loginErr, loginRes) {
                expect(loginRes.body.token).to.exist;
                done();
              });
          });
      });

    it('returns a 401 Unauthorized if the password was incorrect', function(done) {
      api.post('/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' })
        .expect(401, { error: 'The email and password entered don\'t match.' }, done);
    });

    it('returns a 404 Not Found if a user with the given email does not exist', function(done) {
      api.post('/auth/login')
        .send({ email: 'nonexistentuser@test.com', password: 'password' })
        .expect(404, { error: 'An account with that email has not been registered.' }, done);
    });

    it('returns a 404 Not Found if a user with the given pid does not exist', function(done) {
      api.post('/auth/login')
        .send({ pid: 'nonexistentpid' })
        .expect(404, { error: 'An account with that pid has not been registered.' }, done);
    });

    it('returns a 200 OK when logging in with valid credentials', function(done) {
      api.post('/auth/login')
        .send({ email: 'test@test.com', password: 'password' })
        .expect(200, function(err, res) {
          expect(res.body.token).to.exist;
          done();
        });
    });
  });
});
