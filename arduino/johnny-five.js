'use strict';

import five from 'johnny-five';
import Weather from '../api/weather/weather.model';
import config from '../config/environment';

/**
 * Init function for arduino Board
 * 
 * @export
 */
export default function init() {
  // Initialize Board
  var Board = new five.Board({
    port: config.arduinoPorts.johnnyFive
  });

  Board.on('error', () => {

  });

  Board.on('ready', () => {

     // Indoor Temperature
    new five.Thermometer({
      pin: 'A0',
      freq: config.johnnyfivefreq,
      toCelsius: (raw) => {
        var CELSIUS_TO_KELVIN = 273.15;
        var adcres = 1023;
        var beta = 3975;
        var rb = 10000;
        var tempr = 298.15;

        var rthermistor = (adcres - raw) * rb / raw;
        var tempc = 1 / (Math.log(rthermistor / rb) / beta + 1 / tempr) - CELSIUS_TO_KELVIN;

        return tempc;
      }
    }).on('data', () => {
      saveWeather('indoorTemp', round(this.celsius));
    });

    // Outdoor Temperature
    new five.Thermometer({
      controller: 'DS18B20',
      pin: 2,
      freq: config.johnnyfivefreq
    }).on('data', () => {
      saveWeather('outdoorTemp', round(this.celsius));
    });

    // Pressure
    new five.Barometer({
      controller: 'BMP085',
      freq: config.johnnyfivefreq
    }).on('data', () => {
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

