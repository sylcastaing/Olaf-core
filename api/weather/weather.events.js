'use strict';

import {
  EventEmitter
}
from 'events';
import Weather from './weather.model';
let WeatherEvents = new EventEmitter();

WeatherEvents.setMaxListeners(0);

export const events = ['save'];

export default WeatherEvents;