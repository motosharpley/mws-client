const gulp = require('gulp');
const del = require('del');
const workboxBuild = require('workbox-build');
const runSequence = require('run-sequence');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const pump = require('pump');


// this task removes old files
gulp.task('clean', () => del('dist', { dot: true }));

//  --- Static Assets ---
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
});

gulp.task('css', function () {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('img', function () {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist/img'))
});

gulp.task('manifest', function () {
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest('dist'))
});

// --- JS Assets ---
// This task copies and uglifies our js files
gulp.task('js', function (cb) {
  pump([
    gulp.src('src/js/*.js'),
    uglify(),
    gulp.dest('dist/js')
  ],
    cb
  );
});

// Uglify service worker
gulp.task('sw', function (cb) {
  pump([
    gulp.src('src/sw.js'),
    uglify(),
    gulp.dest('dist')
  ],
    cb
  );
});

// this task watches our "src" files & rebuilds whenever they change
gulp.task('watch', function () {
  gulp.watch('src/**/*', ['default']);
});

// this is our default task
gulp.task('default', ['clean'], cb => {
  runSequence(
    'html',
    'css',
    'img',
    'manifest',
    'js',
    'sw',
    cb
  );
});
