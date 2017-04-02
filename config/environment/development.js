'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1/olaf-dev'
  },

  // Seed database on startup
  seedDB: true,

  // Freq in ms for weather mesure
  johnnyfivefreq: 100000
};