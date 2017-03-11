/**
 * Main application file
 */

'use strict';

import config from './config/environment';
import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import http from 'http';
import chalk from 'chalk';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Create App and Server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io').listen(server);

if (config.seedDB) {
  require('./config/seed');
}

// Configure socket
require('./config/socket').default(socketio);

// Configure Express
require('./config/express').default(app);

// Expose routes
require('./routes').default(app);

// Start server function
function startServer() {
  app.olafCore = server.listen(config.port, config.ip, function() {
    console.log(chalk.green('Express server listening on ') + chalk.gray(config.port) + chalk.green(' in ') + chalk.gray(app.get('env')) + chalk.green(' mode !'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;