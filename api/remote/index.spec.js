'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var remoteCtrlStub = {
  index: 'remoteCtrl.index',
  liveboxKeys: 'remoteCtrl.liveboxKeys',
  show: 'remoteCtrl.show',
  create: 'remoteCtrl.create',
  update: 'remoteCtrl.update',
  destroy: 'remoteCtrl.destroy'
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
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var remoteIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './remote.controller': remoteCtrlStub,
  '../../auth/auth.service': authServiceStub
});

describe('Remote API Router:', function() {

  it('should return an express router instance', function() {
    expect(remoteIndex).to.equal(routerStub);
  });

  describe('GET /api/remotes', function() {

    it('should route to remote.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authService.isAuthenticated', 'remoteCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/remotes/livebox', function() {

    it('should route to remote.controller.liveboxKeys', function() {
      expect(routerStub.get
        .withArgs('/livebox', 'authService.hasRole.admin', 'remoteCtrl.liveboxKeys')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/remotes/:id', function() {

    it('should route to remote.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'remoteCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/remotes', function() {

    it('should route to remote.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.hasRole.admin', 'remoteCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/remotes/:id', function() {

    it('should route to remote.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authService.hasRole.admin', 'remoteCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/remotes/:id', function() {

    it('should route to remote.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authService.hasRole.admin', 'remoteCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/remotes/:id', function() {

    it('should route to remote.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'remoteCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });
});
