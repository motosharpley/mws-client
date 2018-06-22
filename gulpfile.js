const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');

//  --- Static Assets ---
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('img', function() {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('dist/img'))
})

gulp.task('manifest', function() {
  return gulp.src('src/manifest.json')
    .pipe(gulp.dest('dist'))
})

// --- JS Assets ---
gulp.task('sw', function() {
  return gulp.src('src/sw.js')
    .pipe(gulp.dest('dist'))
})

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(gulp.dest('dist/js'))
})




gulp.task('default', ['html', 'css', 'img', 'manifest', 'sw', 'js'])