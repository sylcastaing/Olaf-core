/**
 * Main application file
 */

'use strict';

import config from './config/environment';
import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import http from 'http';

import * as arduino from './arduino/johnny-five';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Create App and Server
var app = express();
var server = http.createServer(app);

if (config.seedDB) {
  require('./config/seed');
}

// Configure Express
require('./config/express').default(app);

// Expose routes
require('./routes').default(app);

// Start server function
function startServer() {
  app.olafCore = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

// Init Arduino
arduino.init();

setImmediate(startServer);

// Expose app
exports = module.exports = app;