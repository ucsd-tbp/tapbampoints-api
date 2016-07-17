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

    it('returns a 400 Bad Request when the first name is empty', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: '', last_name: 'Empty First Name' })
        .expect(400, [{
          param: 'first_name',
          msg: 'Your first name can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the last name is empty', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Empty Last Name', last_name: '' })
        .expect(400, [{
          param: 'last_name',
          msg: 'Your last name can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the barcode is empty', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ barcode: '' })
        .expect(400, [{
          param: 'barcode',
          msg: 'The barcode can\'t be empty.',
          value: '',
        }], done);
    });

    it('returns a 400 Bad Request when the house is not of Red, Green, or Blue', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ house: 'Orange' })
        .expect(400, [{
          param: 'house',
          msg: 'The house must be Red, Green, or Blue.',
          value: 'Orange',
        }], done);
    });

    it('returns a 400 Bad Request when the member status is not of Initiate, Member, or Officer', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ member_status: 'None' })
        .expect(400, [{
          param: 'member_status',
          msg: 'The member status must be Initiate, Member, or Officer.',
          value: 'None',
        }], done);
    });

    it('does not update the is_admin field', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', is_admin: true })
        .expect(400, { error: 'Couldn\'t save model! Attributes are invalid.' }, done);
    });
    it('does not update the id field', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', id: true })
        .expect(400, { error: 'Couldn\'t save model! Attributes are invalid.' }, done);
    });

    it('updates the user\'s first and last names with valid input', function(done) {
      api.patch('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'Updated', last_name: 'Name' })
        .expect({ first_name: 'Updated', last_name: 'Name' }, done);
    });

    it('responds with a 401 Unauthorized when trying to update a nonexistent user', function(done) {
      api.patch('/api/users/10')
        .set('Authorization', `Bearer ${token}`)
        .send({ first_name: 'NonexistentUserName' })
        .expect(401, { error: 'Not authorized to access this route.'}, done);
    });

    it('responds with a 401 Unauthorized when a logged in user tries to update a different user', function(done) {
      api.post('/api/auth/register')
        .send({
          first_name: 'Second',
          last_name: 'User',
          barcode: 'barcode2',
        })
        .expect(201, function(err, res) {
          expect(res.body.token).to.exist;

        api.patch('/api/users/1')
          .set('Authorization', `Bearer ${res.body.token}`)
          .send({ first_name: 'Updated', last_name: 'Name' })
          .expect(401, { error: 'Not authorized to access this route.' }, done);
        });
    });
  });

  describe.skip('DELETE /users/:id', function() {
    it('responds with 401 Unauthorized ');

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
