'use strict';

var app = require('../..');
import User from '../user/user.model';
import Weather from './weather.model';
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

  // Clear users and wheather after testing
  after(function() {
    return User.remove().then(function() {
      return Weather.remove();
    })
  });

  describe('GET /api/weather/:start/:end', function () {
    var token;
    var date = new Date();
    var weathers = [
      {
        date: date,
        type: 'pressure',
        value: 1000
      }, {
        date: date,
        type: 'outdoorTemp',
        value: 28
      }
    ];

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

    before(function() {
      return Weather.remove().then(function() {
        return Weather.create(weathers);
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

    it('should respond with a 400 when invalid timestamp', function(done) {
      request(app)
        .get('/api/weather/111111111111111111111111111111/11111111111111111111111111111')
        .set('authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should respond with an array when valid timestamp', function(done) {
      request(app)
        .get('/api/weather/' + (date.getTime() - 10) + '/' + (date.getTime() + 10))
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.instanceOf(Array);
          expect(res.body).to.have.length(2);
          done();
        });
    });
  });
});