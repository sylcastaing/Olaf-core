'use strict';

import {
  EventEmitter
}
from 'events';
import Weather from './weather.model';
var WeatherEvents = new EventEmitter();

WeatherEvents.setMaxListeners(0);

var events = {
  'save': 'save'
};

for (var e in events) {
  var event = events[e];
  Weather.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    WeatherEvents.emit(event + ':' + doc._id, doc);
    WeatherEvents.emit(event, doc);
  }
}

export default WeatherEvents;