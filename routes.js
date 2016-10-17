/**
 * Main application routes
 */

'use strict';

export default function (app) {
  app.use('/api/users', require('./api/user'));
  app.use('/api/weather', require('./api/weather'));

  app.use('/auth', require('./auth').default);
}