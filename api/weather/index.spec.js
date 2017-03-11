'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var weatherCtrlStub = {
  search: 'weatherCtrl.search',
  getLastIndoorTemp: 'weatherCtrl.getLastIndoorTemp',
  getLastOutdoorTemp: 'weatherCtrl.getLastOutdoorTemp',
  getLastPressure: 'weatherCtrl.getLastPressure'
};

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return 'authService.hasRole.' + role;
  }
};

var routerStub = {
  get: sinon.spy(),
};

// require the index with our stubbed out modules
var weatherIndex = proxyquire('./index.js', {
  'express': {
    Router: function () {
      return routerStub;
    }
  },
  './weather.controller': weatherCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Weather API Router:', function () {

  it('should return an express router instance', function () {
    expect(weatherIndex).to.equal(routerStub);
  });

  describe('GET /y/indoorTemp/last', function () {
    it('should be authenticated and route to weather.controller.getLastIndoorTemp', function () {
      expect(routerStub.get
        .withArgs('/indoorTemp/last', 'authService.isAuthenticated', 'weatherCtrl.getLastIndoorTemp')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/indoorTemp/:start/:end/extreme', function () {
    it('should be authenticated and route to weather.controller.getExtremeIndoorTemp', function () {
      expect(routerStub.get
        .withArgs('/indoorTemp/last', 'authService.isAuthenticated', 'weatherCtrl.getExtremeIndoorTemp')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/outdoorTemp/last', function () {
    it('should be authenticated and route to weather.controller.getLastOutdoorTemp', function () {
      expect(routerStub.get
        .withArgs('/outdoorTemp/last', 'authService.isAuthenticated', 'weatherCtrl.getLastOutdoorTemp')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/outdoorTemp/:start/:end/extreme', function () {
    it('should be authenticated and route to weather.controller.getExtremeOutdoorTemp', function () {
      expect(routerStub.get
        .withArgs('/indoorTemp/last', 'authService.isAuthenticated', 'weatherCtrl.getExtremeOutdoorTemp')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/pressure/last', function () {
    it('should be authenticated and route to weather.controller.getLastPressure', function () {
      expect(routerStub.get
        .withArgs('/pressure/last', 'authService.isAuthenticated', 'weatherCtrl.getLastPressure')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/pressure/:start/:end/extreme', function () {
    it('should be authenticated and route to weather.controller.getExtremePressure', function () {
      expect(routerStub.get
        .withArgs('/indoorTemp/last', 'authService.isAuthenticated', 'weatherCtrl.getExtremePressure')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /y/:start/:end', function () {
    it('should be authenticated and route to weather.controller.search', function () {
      expect(routerStub.get
        .withArgs('/:start/:end', 'authService.isAuthenticated', 'weatherCtrl.search')
      ).to.have.been.calledOnce;
    });
  });
});
