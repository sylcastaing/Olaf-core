'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/olaf-dev'
  },

  // Seed database on startup
  seedDB: true,

  // Freq in ms for weather mesure
  johnnyfivefreq: 60000
};