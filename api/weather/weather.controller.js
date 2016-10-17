/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     api/weather/:start/:end              ->  search
 */

'use strict';

import _ from 'lodash';
import Weather from './weather.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Get Weather datas between 2 dates
export function search(req, res) {
  return Weather.find({
      date: {
        $lte: new Date(parseInt(req.params.end)),
        $gt: new Date(parseInt(req.params.start))
      }
    }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
