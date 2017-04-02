/***************************************************************
 *    REQUIRE GULP and PLUGINS
 ***************************************************************/

var gulp = require('gulp'),                     //gulp.task(), gulp.src(), gilp.dest(), gulp.watch(), pipe()
    // JAVASCRIPT
    uglify = require('gulp-uglify'),

    //SASS
    postcss = require('gulp-postcss'),          //postcss per autoprefixer
    autoprefixer = require('autoprefixer'),     //autoprefixer (vendor prefixing for CSS)
    sass = require('gulp-sass');                // SASS / SCSS compiler



/***************************************************************
 *    JS TASKS
 ***************************************************************/

// JS MINIFICATION
gulp.task('uglify', function() {
  return gulp.src('app/js/*.js')              //origine
        .pipe(uglify())                       //minifica
        .pipe(gulp.dest('app/js/min'));       //destinazione
});



/***************************************************************
 *    SASS TASKS
 ***************************************************************/

// SASS COMPILING (task che sarà chiamata da 'autoprefixer')
gulp.task('sass', function() {
  //importante il 'return' dello stream
  return gulp.src('app/scss/*.scss')                //origine
        .pipe(sass({                                //compilazione
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('app/css'));                //destinazione
});

// AUTOPREFIXER (esegui prime la task 'sass')
gulp.task('autoprefixer', ['sass'], function() {
  return gulp.src('app/css/*.css')                  //origine
        .pipe(postcss( [ autoprefixer() ] ))        //autoprefixer
        .pipe(gulp.dest('app/css'));                //destinazione
});




/***************************************************************
 *    WATCH JS / SASS FILES ON SAVE -> 'gulp watch'
 ***************************************************************/

gulp.task('watch', function(){
  gulp.watch('app/scss/*.scss', ['autoprefixer']);
  gulp.watch('app/js/*.js', ['uglify']);
});



/***************************************************************
 *    START GULP WATCHING -> 'gulp'
 ***************************************************************/

gulp.task('default', ['watch']);
