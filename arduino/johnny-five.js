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

  var lastsMeasure = [
    new Weather({
      type: 'indoorTemp',
      value: 0
    }),
    new Weather({
      type: 'outdoorTemp',
      value: 0
    }),
    new Weather({
      type: 'pressure',
      value: 0
    })
  ];

  var displayIndex = 0;

  // Initialize Board
  var Board = new five.Board({
    port: config.arduinoPorts.johnnyFive
  });

  Board.on('error', () => {

  });

  Board.on('ready', () => {

    var lcd = new five.LCD({
      controller: "JHD1313M1"
    });

    lcd.clear();
    lcd.bgColor("000000");
    lcd.on();
    lcd.home().print("Wesh alors ! ");

    display();

    var prevButton = new five.Button(5);
    var nextButton = new five.Button(6);
    var screenOff;

    // Turn screen on on press and turn off after 5sec
    prevButton.on('press', () => {
      (displayIndex > 0) ? displayIndex-- : displayIndex = 2;
      display();
      screenOn();
    });

    nextButton.on('press', () => {
      (displayIndex < 2) ? displayIndex++ : displayIndex = 0;
      display();
      screenOn();
    });

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
    }).on('data', function() {
      saveWeather('indoorTemp', round(this.celsius));
    });

    // Outdoor Temperature
    new five.Thermometer({
      controller: 'DS18B20',
      pin: 2,
      freq: config.johnnyfivefreq
    }).on('data', function() {
      saveWeather('outdoorTemp', round(this.celsius));
    });

    // Pressure
    new five.Barometer({
      controller: 'BMP085',
      freq: config.johnnyfivefreq
    }).on('data', function() {
      saveWeather('pressure', round(this.pressure * 10));
    });

    function display() {
      lcd.clear();
      lcd.cursor(0, 0).print(displayDate());
      lcd.cursor(1, 0).print(displayMeasure());
    }

    function screenOn() {
      clearTimeout(screenOff);
      lcd.bgColor("ffffff");
      screenOff = setTimeout(function() {
        lcd.bgColor("000000");
      }, 10000);
    }

    /**
    * Save Weather object in database
    * 
    * @param {any} type
    * @param {any} value
    */
    function saveWeather(type, value) {
      let newWeather = new Weather({
        date: new Date(),
        type: type,
        value: value
      });

      if (newWeather.type === 'indoorTemp') {
        lastsMeasure[0] = newWeather;
      }
      else if (newWeather.type === 'outdoorTemp') {
        lastsMeasure[1] = newWeather;
      }
      else if (newWeather.type === 'pressure') {
        lastsMeasure[2] = newWeather;
      }

      display();

      return newWeather.save();
    }

    setInterval(display, 60000);
  });

  /**
   * Display a measure
   * 
   * @returns 
   */
  function displayMeasure() {
    let current = lastsMeasure[displayIndex];
    
    let type = 'Int';
    let unit = 'C';

    if (current.type === 'outdoorTemp') {
      type = 'Ext';
    }
    else if (current.type === 'pressure') {
      type = 'Press';
      unit = ' hPa';
    }

    return type + ' : ' + current.value + unit;
  }
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

/**
 * Return a formatted date to String
 * 
 * @returns 
 */
function displayDate() {
  var d = new Date();

  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  let hours = String(d.getHours());
  let minutes = String(d.getMinutes());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

