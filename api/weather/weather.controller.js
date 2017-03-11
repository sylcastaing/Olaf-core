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
      return res.status(statusCode).json(entity);
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
  })
  .sort('-date')
  .exec()
  .then((datas) => {
    return {
      indoorTemps: datas.filter((elem) => {
        return elem.type === 'indoorTemp';
      }),
      outdoorTemps: datas.filter((elem) => {
        return elem.type === 'outdoorTemp';
      }),
      pressures: datas.filter((elem) => {
        return elem.type === 'pressure';
      })
    };
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 400));
}

export function getLastIndoorTemp(req, res) {
  return Weather.find({
    type: 'indoorTemp'
  })
  .sort('-date')
  .limit(1)
  .exec()
  .then((datas) => {
    if (datas.length > 0) {
      return datas[0];
    }
    throw new Error();
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 404));
}

export function getExtremeIndoorTemp(req, res) {
  return Promise.all([
    getExtreme(req.params.start, req.params.end, 'indoorTemp', 1),
    getExtreme(req.params.start, req.params.end, 'indoorTemp', -1)
  ])
  .then((datas) => {
    return {
      min: datas[0],
      max: datas[1]
    };
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 400));
}

export function getLastOutdoorTemp(req, res) {
  return Weather.find({
    type: 'outdoorTemp'
  })
  .sort('-date')
  .limit(1)
  .exec()
  .then((datas) => {
    if (datas.length > 0) {
      return datas[0];
    }
    throw new Error();
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 404));
}

export function getExtremeOutdoorTemp(req, res) {
  return Promise.all([
    getExtreme(req.params.start, req.params.end, 'outdoorTemp', 1),
    getExtreme(req.params.start, req.params.end, 'outdoorTemp', -1)
  ])
  .then((datas) => {
    return {
      min: datas[0],
      max: datas[1]
    };
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 400));
}

export function getLastPressure(req, res) {
  return Weather.find({
    type: 'pressure'
  })
  .sort('-date')
  .limit(1)
  .exec()
  .then((datas) => {
    if (datas.length > 0) {
      return datas[0];
    }
    throw new Error();
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 404));
}

export function getExtremePressure(req, res) {
  return Promise.all([
    getExtreme(req.params.start, req.params.end, 'pressure', 1),
    getExtreme(req.params.start, req.params.end, 'pressure', -1)
  ])
  .then((datas) => {
    return {
      min: datas[0],
      max: datas[1]
    };
  })
  .then(respondWithResult(res))
  .catch(handleError(res, 400));
}

/**
 * getExtreme
 * 
 * @param {any} start 
 * @param {any} end 
 * @param {any} type 
 * @param {any} sort 
 * @returns 
 */
function getExtreme(start, end, type, sort) {
  return Weather.find({
    type: type,
    date: {
      $lte: new Date(parseInt(end)),
      $gt: new Date(parseInt(start))
    }
  })
  .sort({
    value: sort
  })
  .limit(1)
  .exec()
  .then((datas) => {
    if (datas.length > 0) {
      return datas[0];
    }
    throw new Error();
  });
}

