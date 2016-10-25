'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('babel-register');

// Export the application
exports = module.exports = require('./app');