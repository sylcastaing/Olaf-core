'use strict';

var app = require('../..');
import User from '../user/user.model';
import request from 'supertest';

describe('Weather API:', function () {
  var user;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /api/weather/:16540540/:16540640', function () {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weather/a/b')
        .expect(401)
        .end(done);
    });

    it('should respond with a 400 when invalid timestamp', function(done) {
      request(app)
        .get('/api/weather/a/b')
        .set('authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });
  });
});