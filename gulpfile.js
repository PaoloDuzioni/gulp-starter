/***************************************************************
 *    REQUIRE GULP and PLUGINS
 ***************************************************************/

var gulp = require('gulp'),                     //gulp.task(), gulp.src(), gilp.dest(), gulp.watch(), pipe()
    // JAVASCRIPT
    uglify = require('gulp-uglify'),

    //SASS
    postcss = require('gulp-postcss'),          //postcss per autoprefixer
    autoprefixer = require('autoprefixer'),     //autoprefixer (vendor prefixing for CSS)
    sass = require('gulp-sass'),                // SASS / SCSS compiler

    //BrowserSync
    browserSync = require('browser-sync');      // Browser auto-refresh



/***************************************************************
 *    JS TASKS
 ***************************************************************/

// JS MINIFICATION
gulp.task('uglify', function() {
  return gulp.src('app/js/*.js')              //origine
        .pipe(uglify())                       //minifica
        .pipe(gulp.dest('app/js/min'))        //destinazione
        .pipe(browserSync.stream());          //passa lo stream a BrowserSync
});



/***************************************************************
 *    SASS TASKS
 ***************************************************************/

// SASS COMPILING (task che sarà chiamata da 'autoprefixer')

var compDir = 'app/styles/*.sass'; // <--((Change here to .scss or .sass syntax))

gulp.task('sass', function() {
  //importante il 'return' dello stream
  return gulp.src(compDir)                          //origine
        .pipe(sass({                                //compilazione
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('app/css'));                //destinazione
});

// AUTOPREFIXER (esegui prime la task 'sass')
gulp.task('autoprefixer', ['sass'], function() {
  return gulp.src('app/css/*.css')                  //origine
        .pipe(postcss( [ autoprefixer() ] ))        //autoprefixer
        .pipe(gulp.dest('app/css'))                 //destinazione
        .pipe(browserSync.stream());                //passa lo stream a BrowserSync
});




/***************************************************************
 *    WATCH JS / SASS FILES ON SAVE -> 'gulp watch'
 ***************************************************************/

gulp.task('watch', function(){
  //sets browsersynch
  browserSync.init({
    server: "./app",   //da dove servire i files del progetto
    notify: false      //niente pop-up di notifica nel browser
  });

  gulp.watch(compDir, ['autoprefixer']);
  gulp.watch('app/js/*.js', ['uglify']);
  gulp.watch("app/*.html").on('change', browserSync.reload);  //ricarica per i file HTML
});



/***************************************************************
 *    START GULP WATCHING -> 'gulp'
 ***************************************************************/

gulp.task('default', ['watch']);
