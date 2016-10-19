'use strict';

import five from 'johnny-five';
import Weather from '../api/weather/weather.model';
import config from '../config/environment';

/**
 * Init function for arduino Board
 * 
 * @export
 */
export function init() {
  // Initialize Board
  var Board = new five.Board();

  Board.on('ready', function() {

     // Indoor Temperature
    new five.Thermometer({
      pin: 'A0',
      freq: config.johnnyfivefreq,
      toCelsius: function (raw) {
        var CELSIUS_TO_KELVIN = 273.15;
        var adcres = 1023;
        var beta = 3975;
        var rb = 10000;
        var tempr = 298.15;

        var rthermistor = (adcres - raw) * rb / raw;
        var tempc = 1 / (Math.log(rthermistor / rb) / beta + 1 / tempr) - CELSIUS_TO_KELVIN;

        return tempc;
      }
    }).on('data', function () {
      saveWeather('indoorTemp', round(this.celsius));
    });

    // Outdoor Temperature
    new five.Thermometer({
      controller: 'DS18B20',
      pin: 2,
      freq: config.johnnyfivefreq
    }).on('data', function () {
      saveWeather('outdoorTemp', round(this.celsius));
    });

    // Pressure
    new five.Barometer({
      controller: 'BMP085',
      freq: config.johnnyfivefreq
    }).on('data', function () {
      saveWeather('pressure', round(this.pressure * 10));
    });
  });
}

/**
 * Save Weather object in database
 * 
 * @param {any} type
 * @param {any} value
 */
function saveWeather(type, value) {
  new Weather({
    date: new Date(),
    type: type,
    value: value
  }).save();
}

/**
 * Round value to 1 digit
 * 
 * @param {any} value
 * @returns int round value
 */
function round(value) {
  var result = parseInt(value);
  return (!isNaN(result) ? Math.round(value * 10) / 10 : value);
}

