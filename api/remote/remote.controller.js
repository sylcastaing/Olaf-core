/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/remotes              ->  index
 * POST    /api/remotes              ->  create
 * GET     /api/remotes/:id          ->  show
 * PUT     /api/remotes/:id          ->  update
 * DELETE  /api/remotes/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Remote from './remote.model';
import livebox from '../../config/box/livebox';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Remotes
export function index(req, res) {
  return Remote.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Remote from the DB
export function show(req, res) {
  return Remote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Remote in the DB
export function create(req, res) {
  return Remote.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Remote in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Remote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Remote from the DB
export function destroy(req, res) {
  return Remote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Get livebox keys
export function liveboxKeys(req, res) {
  return res.json(livebox);
}