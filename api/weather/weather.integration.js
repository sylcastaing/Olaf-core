'use strict';

var app = require('../..');
import User from '../user/user.model';
import Weather from './weather.model';
import request from 'supertest';

describe('Weather API:', function () {
  var user;
  var token;
  var date;

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

  // Clear users and wheather after testing
  after(function() {
    return User.remove().then(function() {
      //return Weather.remove();
    })
  });

  describe('GET /api/weathers/:start/:end', function () {
    date = new Date();

    before(function() {
      return Weather.remove()
        .then(function() {
          return Weather.create([
            {
              date: date.getTime(),
              type: 'pressure',
              value: 1000
            }, {
              date: date.getTime(),
              type: 'outdoorTemp',
              value: 28
            }, {
              date: date.getTime() - 1000,
              type: 'indoorTemp',
              value: 26
            }, {
              date: date.getTime() + 1000,
              type: 'indoorTemp',
              value: 28
            }, {
              date: date.getTime() - 1000,
              type: 'pressure',
              value: 1002
            }, {
              date: date.getTime() + 1000,
              type: 'pressure',
              value: 1001
            }, {
              date: date.getTime() + 2500,
              type: 'pressure',
              value: 1001
            }
          ]);
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weathers/a/b')
        .expect(401)
        .end(done);
    });

    it('should respond with a 400 when invalid timestamp', function(done) {
      request(app)
        .get('/api/weathers/a/b')
        .set('authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should respond with a 400 when invalid timestamp', function(done) {
      request(app)
        .get('/api/weathers/111111111111111111111111111111/11111111111111111111111111111')
        .set('authorization', 'Bearer ' + token)
        .expect(400)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should respond with an array when valid timestamp', function(done) {
      request(app)
        .get('/api/weathers/' + (date.getTime() - 2000) + '/' + (date.getTime() + 2000))
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.be.instanceOf(Object);
          expect(res.body).to.not.be.instanceOf(Array);

          expect(res.body.indoorTemps).to.be.instanceOf(Array);
          expect(res.body.outdoorTemps).to.be.instanceOf(Array);
          expect(res.body.pressures).to.be.instanceOf(Array);

          expect(res.body.indoorTemps).to.have.length(2);
          expect(res.body.outdoorTemps).to.have.length(1);
          expect(res.body.pressures).to.have.length(3);

          done();
        });
    });
  });

  describe('GET /api/weathers/indoorTemp/last', function () {
    before(function() {
      return Weather.remove()
        .then(function() {
          return Weather.create([
            {
              date: date.getTime(),
              type: 'indoorTemp',
              value: 25
            }, {
              date: date.getTime() - 10,
              type: 'indoorTemp',
              value: 24
            }, {
              date: date.getTime() + 10,
              type: 'indoorTemp',
              value: 26
            }, {
              date: date.getTime() - 12,
              type: 'outdoorTemp',
              value: 25
            }
          ]);
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weathers/indoorTemp/last')
        .expect(401)
        .end(done);
    });

    it('should respond with an object with the last indoorTemp', function(done) {
      request(app)
        .get('/api/weathers/indoorTemp/last')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.not.be.instanceOf(Array);
          expect(res.body).to.be.instanceOf(Object);
          expect(res.body.type).to.be.equal('indoorTemp');
          expect(new Date(res.body.date).getTime()).to.be.equal(date.getTime() + 10);
          expect(res.body.value).to.be.equal(26);
          done();
        });
    });

    describe('If dataBase is empty', function() {
      before(function() {
        return Weather.remove();
      });

      it('should respond width null is no weather were found', function(done) {
        request(app)
        .get('/api/weathers/indoorTemp/last')
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
      });
    });
  });

  describe('GET /api/weathers/indoorTemp/:start/:end/extreme', function () {
    before(function() {
      return Weather.remove()
        .then(function() {
          return Weather.create([
            {
              date: date.getTime(),
              type: 'indoorTemp',
              value: 25
            }, {
              date: date.getTime() - 1500,
              type: 'indoorTemp',
              value: 20
            }, {
              date: date.getTime() + 10,
              type: 'indoorTemp',
              value: 26
            }, {
              date: date.getTime() - 12,
              type: 'outdoorTemp',
              value: 24
            }
          ]);
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weathers/indoorTemp/' + (date.getTime() - 1000) + '/' + (date.getTime() + 2000) + '/extreme')
        .expect(401)
        .end(done);
    });

    it('should respond with an object with min and max', function(done) {
      request(app)
        .get('/api/weathers/indoorTemp/' + (date.getTime() - 1000) + '/' + (date.getTime() + 2000) + '/extreme')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.not.be.instanceOf(Array);
          expect(res.body).to.be.instanceOf(Object);
          expect(res.body.min).to.be.instanceOf(Object);
          expect(res.body.max).to.be.instanceOf(Object);
          expect(res.body.min.value).to.be.equal(25);
          expect(res.body.max.value).to.be.equal(26);

          done();
        });
    });
  });

  describe('GET /api/weathers/outdoorTemp/last', function () {
    before(function() {
      return Weather.remove()
        .then(function() {
          return Weather.create([
            {
              date: date.getTime() + 10,
              type: 'outdoorTemp',
              value: 32
            }, {
              date: date.getTime() - 10,
              type: 'outdoorTemp',
              value: 26
            }, {
              date: date,
              type: 'outdoorTemp',
              value: 28
            }, {
              date: date.getTime() + 10,
              type: 'indoorTemp',
              value: 25
            }
          ]);
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weathers/outdoorTemp/last')
        .expect(401)
        .end(done);
    });

    it('should respond with an object with the last outdoorTemp', function(done) {
      request(app)
        .get('/api/weathers/outdoorTemp/last')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.not.be.instanceOf(Array);
          expect(res.body).to.be.instanceOf(Object);
          expect(res.body.type).to.be.equal('outdoorTemp');
          expect(new Date(res.body.date).getTime()).to.be.equal(date.getTime() + 10);
          expect(res.body.value).to.be.equal(32);
          done();
        });
    });

    describe('If dataBase is empty', function() {
      before(function() {
        return Weather.remove();
      });

      it('should respond width null is no weather were found', function(done) {
        request(app)
        .get('/api/weathers/outdoorTemp/last')
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
      });
    });
  });

  describe('GET /api/weathers/pressure/last', function () {
    before(function() {
      return Weather.remove().then(function() {
        return Weather.create([
          {
            date: date.getTime() + 10,
            type: 'pressure',
            value: 1001
          }, 
          {
            date: date,
            type: 'pressure',
            value: 1000
          }, {
            date: date,
            type: 'outdoorTemp',
            value: 28
          }, {
            date: date.getTime() + 10,
            type: 'indoorTemp',
            value: 26
          }
        ]);
      });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/weathers/pressure/last')
        .expect(401)
        .end(done);
    });

    it('should respond with an object with the last outdoorTemp', function(done) {
      request(app)
        .get('/api/weathers/pressure/last')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.not.be.instanceOf(Array);
          expect(res.body).to.be.instanceOf(Object);
          expect(res.body.type).to.be.equal('pressure');
          expect(new Date(res.body.date).getTime()).to.be.equal(date.getTime() + 10);
          expect(res.body.value).to.be.equal(1001);
          done();
        });
    });

    describe('If dataBase is empty', function() {
      before(function() {
        return Weather.remove();
      });

      it('should respond width null is no weather were found', function(done) {
        request(app)
        .get('/api/weathers/pressure/last')
        .set('authorization', 'Bearer ' + token)
        .expect(404)
        .expect('Content-Type', /json/)
        .end(done);
      });
    });
  });
});