'use strict';

var g = require('gulp-load-plugins')();
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var karma = require('karma').server;
var del = require('del');

var babelifyConfig = {
  optional: ["runtime"],
  blacklist: ["regenerator"]
};

var paths = {
  app: './src',
  scriptsEntry: './src/js/app.js',
  html: [
    './src/index.html'
  ],
  temp: './.tmp',
  sass: './src/scss/**/*.scss',
  sassDest: './src/scss/main.scss'
};

gulp.task('default', ['watch']);

gulp.task('watch', ['serve'], function () {
  gulp.watch(paths.html, function (evt) {
    gulp.src(evt.path).pipe(g.connect.reload());
  });
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('build', function (done) {
  runSequence('clean', ['scripts', 'sass'], 'html', done);
});

gulp.task('scripts', function () {
  return browserifyShare();
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.temp));
});

gulp.task('clean', function (done) {
  del([paths.temp, paths.temp], done);
});

gulp.task('sass', function () {
  return gulp.src(paths.sassDest)
    // .pipe(g.sourcemaps.init())
    .pipe(g.sass({ errLogToConsole: true }))
    .pipe(g.autoprefixer({ browsers: ['last 2 versions', 'ie 10'] }))
    // .pipe(g.sourcemaps.write())
    .pipe(gulp.dest(paths.temp + '/css'))
    .pipe(g.connect.reload());
});

gulp.task('serve', ['build'], function() {
  g.connect.server({
    root: [paths.temp, paths.app],
    port: 8080,
    livereload: true
  });
});

function browserifyShare() {
  var b = browserify(paths.scriptsEntry, {
    cache: {},
    packageCache: {},
    debug: true
  });

  b.transform(babelify.configure(babelifyConfig));

  watchify(b).on('update', function() {
    bundleShare(b);
  });

  b.on('log', g.util.log);

  return bundleShare(b);
}

function bundleShare(b) {
  return b.bundle()
    .pipe(g.plumber({errorHandler: g.notify.onError('<%= error.message %>')}))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.temp + '/js'))
    .pipe(g.connect.reload());
}
