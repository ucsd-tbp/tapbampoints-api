const expect = require('chai').expect;

const app = require('../server/app');
const api = require('supertest')(app);

const { helpers, queries } = require('./helpers');

describe('Users', function() {
  before('inserts a regular and admin user into the database', function(done) {
    return helpers.migrateWithQueries(queries.users).then(() => done());
  });

  after(helpers.rollback);

  describe('GET /users/:id', function() {
    it('returns the user with the correct info', function(done) {
      api.get('/users/1')
        .expect(200, {
          id: 1,
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
          house: 'none',
          member_status: 'Initiate',
        }, done);
    });

    it('responds with a 404 Not Found when trying to get a nonexistent user', function(done) {
      api.get('/users/100')
        .expect(404, {
          error: 'User not found.',
        }, done);
    });
  });

  describe('GET /users', function() {
    it('returns a list of users', function(done) {
      api.get('/users')
        .expect(200, [
          {
            id: 1,
            email: 'test@test.com',
            first_name: 'Test',
            last_name: 'User',
            house: 'none',
            member_status: 'Initiate',
          },
          {
            id: 2,
            email: 'admin@test.com',
            first_name: 'Admin',
            last_name: 'User',
            house: 'none',
            member_status: 'Initiate',
          },
        ], done);
    });
  });

  describe('PATCH /users/:id', function() {
    let token = null;

    before(function(done) {
      api.post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
    });

    it('returns a 400 Bad Request when the first name is empty', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: '', last_name: 'Empty First Name' })
        .expect(400, [{
          param: 'first_name',
          msg: 'Your first name can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the last name is empty', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Empty Last Name', last_name: '' })
        .expect(400, [{
          param: 'last_name',
          msg: 'Your last name can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the pid is empty', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ pid: '' })
        .expect(400, [{
          param: 'pid',
          msg: 'The pid can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the house is not of red, green, or blue', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ house: 'Orange' })
        .expect(400, [{
          param: 'house',
          msg: 'The house must be red, green, or blue.',
          value: 'Orange',
        }], done);
    });

    it('returns a 400 Bad Request when the member status is not of Initiate, Member, or Officer',
      function(done) {
        api.patch('/users/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ member_status: 'none' })
          .expect(400, [{
            param: 'member_status',
            msg: 'The member status must be Initiate, Member, or Officer.',
            value: 'none',
          }], done);
      });

    it('does not update the is_admin field', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', is_admin: true })
        .expect(400, { error: 'Couldn\'t save model! Attributes are invalid.' }, done);
    });
    it('does not update the id field', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', id: true })
        .expect(400, { error: 'Couldn\'t save model! Attributes are invalid.' }, done);
    });

    it('updates the user\'s first and last names with valid input', function(done) {
      api.patch('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', last_name: 'Name' })
        .expect({ first_name: 'Updated', last_name: 'Name' }, done);
    });

    it('responds with a 401 Unauthorized when trying to update a nonexistent user', function(done) {
      api.patch('/users/10')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'nonexistentUserName' })
        .expect(401, { error: 'Not authorized to access this route.' }, done);
    });

    it('responds with a 401 Unauthorized when a logged in user tries to update a different user',
      function(done) {
        api.post('/auth/register')
          .send({
            first_name: 'Second',
            last_name: 'User',
            pid: 'pid2',
          })
          .expect(201, function(err, res) {
            expect(res.body.token).to.exist;

            api.patch('/users/1')
              .set('Authorization', `Bearer ${res.body.token}`)
              .send({ first_name: 'Updated', last_name: 'Name' })
              .expect(401, { error: 'Not authorized to access this route.' }, done);
          });
      });
  });

  describe('DELETE /users/:id', function() {
    let token = null;
    let adminToken = null;

    before(function(done) {
      api.post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .end(function(err, res) {
        token = res.body.token;

        api.post('/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin',
        })
        .end(function(adminErr, adminRes) {
          adminToken = adminRes.body.token;
          done();
        });
      });
    });

    it('responds with a 401 Unauthorized when the logged in user isn\'t an admin', function(done) {
      api.delete('/users/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(401, { error: 'Not authorized to access this route.' }, done);
    });

    it('responds with a 204 No Content and deletes the user', function(done) {
      api.delete('/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204, {}, function() {
          api.get('/users/1')
            .expect(404, {
              error: 'User not found.',
            }, done);
        });
    });

    it('responds with a 404 Not Found when trying to delete a nonexistent user', function(done) {
      api.delete('/users/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404, { error: 'User not found.' }, done);
    });
  });
});
