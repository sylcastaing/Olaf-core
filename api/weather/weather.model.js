'use strict';

import mongoose from 'mongoose';

var WeatherSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Weather', WeatherSchema);