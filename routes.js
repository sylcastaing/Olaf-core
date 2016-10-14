/**
 * Main application routes
 */

'use strict';

export default function (app) {
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);
}