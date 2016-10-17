'use strict'

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';

//var config = require('./config/environment');
var plugins = gulpLoadPlugins();

const paths = {
  scripts: [
    './**/!(*.spec|*.integration).js',
    '!/config/local.env.sample.js'
  ],
  test: [
    './**/*.integration.js',
    './**/*.spec.js',
    'mocha.global.js'
  ]
};

var onServerLog = function(log) {
  console.log(plugins.util.colors.white('[') +
      plugins.util.colors.yellow('nodemon') +
      plugins.util.colors.white('] ') +
      log.message);
}

var onError = function(err) {
  plugins.util.beep();
}

let lintServerScripts = lazypipe()
  .pipe(plugins.jshint, '.jshintrc')
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

let mocha = lazypipe()
  .pipe(plugins.mocha, {
      reporter: 'spec',
      timeout: 5000,
      require: [
          './mocha.conf'
      ]
  });

gulp.task('start', ['watch'], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon('-w').on('log', onServerLog)
    .on('crash', onError)
    .on('exit', onError);
});

gulp.task('start:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  nodemon('-w').on('log', onServerLog)
    .on('crash', onError)
    .on('exit', onError);
});

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
    .pipe(lintServerScripts());
});

gulp.task('watch', () => {
  plugins.watch(paths.scripts)
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
    .pipe(plugins.livereload());
});

gulp.task('test', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  return gulp.src(paths.test)
    .pipe(mocha());
});