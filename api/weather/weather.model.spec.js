'use strict';

import app from '../..';
import Weather from './weather.model';

var weather;
var genWeather = function() {
  weather = new Weather({
    date: new Date(),
    type: 'pressure',
    value: 1000,
  });
  return weather;
}

describe('Weather Model', function() {
  before(function() {
    // Clear weathers before testing
    return Weather.remove();
  });

  beforeEach(function() {
    genWeather();
  });

  afterEach(function() {
    return Weather.remove();
  });

  it('should begin with no weathers', function() {
    return expect(Weather.find({}).exec()).to
      .eventually.have.length(0);
  });

  describe('#date', function() {
    it('should fail when saving with a blank date', function() {
      weather.date = '';
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving with a null date', function() {
      weather.date = null;
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving without a date', function() {
      weather.date = undefined;
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving with a non date', function() {
      weather.date = 'azeaze';
      return expect(weather.save()).to.be.rejected;
    });
  });

  describe('#type', function() {
    it('should fail when saving with a blank type', function() {
      weather.type = '';
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving with a null type', function() {
      weather.type = null;
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving without a type', function() {
      weather.type = undefined;
      return expect(weather.save()).to.be.rejected;
    });

    describe('Test enum', function() {
      it('should fail when saving with an invalid type', function() {
        weather.type = 'test';
        return expect(weather.save()).to.be.rejected;
      });

      it('should fail when saving with a valid type', function() {
        weather.type = 'pressure';
        return expect(weather.save()).to.not.be.rejected;
      });

      it('should fail when saving with a valid type', function() {
        weather.type = 'indoorTemp';
        return expect(weather.save()).to.not.be.rejected;
      });

      it('should fail when saving with a valid type', function() {
        weather.type = 'outdoorTemp';
        return expect(weather.save()).to.not.be.rejected;
      });
    });
  });

  describe('#value', function() {
    it('should fail when saving with a blank value', function() {
      weather.value = '';
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving with a null value', function() {
      weather.value = null;
      return expect(weather.save()).to.be.rejected;
    });

    it('should fail when saving without a value', function() {
      weather.value = undefined;
      return expect(weather.save()).to.be.rejected;
    });
  });
});