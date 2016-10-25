'use strict';

import mongoose from 'mongoose';

var StyleSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  backgroundColor: {
    type: String,
    required: true
  }
});

var ButtonSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  label: String,
  icon: String,
  sizeX: Number,
  sizeY: Number,
  row: Number,
  col: Number,
  style: {
    type: StyleSchema,
    required: true
  }
});

var RemoteSchema = new mongoose.Schema({
  name: String,
  position: Number,
  buttons: [ButtonSchema]
});

export default mongoose.model('Remote', RemoteSchema);