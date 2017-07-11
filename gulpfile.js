'use strict';

const gulp = require('gulp'),
      path = "./src/",
      jade = require('gulp-jade'),
      sass = require('gulp-sass'),
      clean = require('gulp-clean'),
      babel = require('gulp-babel'),
      browserSync = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

//task browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './docs'
    }
  })
});

//template jade
gulp.task('jade', () =>{
   return gulp.src([
        path + '/template/**/*.jade',
        '!' + path + '/template/head.jade',
        '!' + path + '/template/header.jade',
        '!' + path + '/template/footer.jade'
       ])
    .pipe(jade({
        pretty: false
    }))
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

//css sass
gulp.task('sass', () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
    .pipe(gulp.dest('docs/assets/css'))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['docs/assets/css', 'docs/assets/images'], {read: false})
    .pipe(clean());
});


//javascript
gulp.task('javascript', () =>{
  return gulp.src('./src/js/app/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./docs/assets/js/app'))
        .pipe(browserSync.reload({ // Reloading with Browser Sync
          stream: true
        }));
});


//
gulp.task('build', ['sass', 'jade', 'javascript']);

//default task
gulp.task('default', ['browserSync', 'build', 'watch'], () => {
  console.log('abacho a lo q es bn')
});

//watch
gulp.task('watch', () =>{

  gulp.watch('./src/template/**/*.jade', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('jade');
  });

  gulp.watch('./src/scss/**/*.scss', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('sass');
  });

   gulp.watch("./src/js/app/**/*.js", ['javascript']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }); 

});