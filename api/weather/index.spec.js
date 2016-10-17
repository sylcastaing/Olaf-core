'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var weatherCtrlStub = {
  search: 'weatherCtrl.search',
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

  describe('GET /y/:start/:end', function () {

    it('should be authenticated and route to weather.controller.search', function () {
      expect(routerStub.get
        .withArgs('/:start/:end', 'authService.isAuthenticated', 'weatherCtrl.search')
      ).to.have.been.calledOnce;
    });

  });
});
