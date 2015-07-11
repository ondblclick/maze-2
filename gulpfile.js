'use strict';

var g        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var os       = require('os');
var es       = require('event-stream');
var parallel = require('concurrent-transform');

var browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    karma = require('karma').server,
    del = require('del');

// Check for --production flag
var isProduction = !!(argv.production);

// Check for --disable-es6 flag
// enables babelify transforms and runtime, defaults to true
var useES6 = !(argv.disableEs6);

var babelifyConfig = {
  optional: ["runtime"],
  blacklist: ["regenerator"]
};

var paths = {
  templates: [
   './src/**/*.html'
   // '!./src/index.html'
  ],
  app: './src',
  scripts: './src/js/**/*.js',
  scriptsEntry: './src/js/app.js',
  html: [
    './src/index.html'
  ],
  dist: './dist',
  temp: './.tmp',
  target: isProduction ? './dist' : './.tmp',
  statics: [
    './src/icons/**',
    './src/fonts/**'
  ],
  images: [
    './src/images/**'
  ],
  sass: './src/scss/**/*.scss',
  sassEntry: './src/scss/main.scss'
};

gulp.task('default', ['watch']);

gulp.task('dist', function (done) {
  isProduction = true;
  paths.target = paths.dist;
  runSequence('clean', ['statics', 'scripts', 'sass'], 'html', done);
});

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
    .pipe(gulp.dest(paths.target));
});

gulp.task('statics', function () {
  return gulp.src(paths.statics, {
    base: paths.app
  }).pipe(gulp.dest(paths.dist));
});

gulp.task('clean', function (done) {
  del([paths.target, paths.temp], done);
});

gulp.task('sass', function () {
  return gulp.src(paths.sassEntry)
    .pipe(g.if(!isProduction, g.sourcemaps.init()))
    .pipe(g.sass({
      errLogToConsole: true
    }))
    .pipe(g.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(g.if(!isProduction, g.sourcemaps.write()))
    .pipe(g.if(isProduction, g.minifyCss()))
    .pipe(g.if(isProduction, g.rev()))
    .pipe(gulp.dest(paths.target + '/css'))
    .pipe(g.if(!isProduction, g.connect.reload()));
});

gulp.task('serve', ['build'], function() {
  g.connect.server({
    root: isProduction ? paths.dist : [paths.temp, paths.app],
    port: 8080,
    livereload: true
  });
});

function browserifyShare() {
  var b = browserify(paths.scriptsEntry, {
    cache: {},
    packageCache: {},
    debug: !isProduction
  });

  if (useES6) {
    b.transform(
      babelify.configure(babelifyConfig)
    );
  }

  var w;
  if (!isProduction) {
    w = watchify(b);

    w.on('update', function() {
      bundleShare(b);
    });
  }

  b.on('log', g.util.log);

  return bundleShare(b);
}

function bundleShare(b) {
  return b.bundle()
    .pipe(g.plumber({errorHandler: g.notify.onError('<%= error.message %>')}))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(g.if(isProduction, g.uglify()))
    .pipe(g.if(isProduction, g.rev()))
    .pipe(gulp.dest(paths.target + '/js'))
    .pipe(g.if(!isProduction, g.connect.reload()));
}
