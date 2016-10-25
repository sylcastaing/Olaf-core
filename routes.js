/**
 * Main application routes
 */

'use strict';

export default function (app) {
  app.use('/api/users', require('./api/user'));
  app.use('/api/weathers', require('./api/weather'));
  app.use('/api/remotes', require('./api/remote'));

  app.use('/auth', require('./auth').default);
}