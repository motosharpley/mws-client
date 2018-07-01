const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const pump = require('pump');

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
gulp.task('sw', function(cb) {
  pump([
      gulp.src('src/sw.js'),
      uglify(),
      gulp.dest('dist')
    ],
    cb
  );  
});

gulp.task('js', function(cb) {
  pump([
      gulp.src('src/js/*.js'),
      uglify(),
      gulp.dest('dist/js')
    ],
    cb
  );  
});

// this task watches our "app" files & rebuilds whenever they change
gulp.task('watch', function() {
  gulp.watch('src/**/*', ['default']);
});


gulp.task('default', ['html', 'css', 'img', 'manifest', 'sw', 'js'])
