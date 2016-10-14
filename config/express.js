/**
 * Express configuration
 */

'use strict';

import bodyParser from 'body-parser';
import compression from 'compression';
import config from './environment';
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import lusca from 'lusca';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';

var MongoStore = connectMongo(session);

export default function(app) {
  var env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(morgan('dev'));

  // Persist sessions with MongoStore / sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'olaf'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env === 'production' && !process.env.SAUCE_USERNAME) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  if ('development' === env || 'test' === env) {
    app.use(errorHandler());
  }
}