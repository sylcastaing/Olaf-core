'use strict';

import mongoose from 'mongoose';

import { default as WeatherEvents, events } from './weather.events';

var WeatherSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['pressure', 'indoorTemp', 'outdoorTemp'],
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

for (var i in events) {
  WeatherSchema.post(events[i], emit(events[i]));
}

function emit(event) {
  return function(doc) {
    WeatherEvents.emit('weather:' + event, doc);
  }
}

export default mongoose.model('Weather', WeatherSchema);