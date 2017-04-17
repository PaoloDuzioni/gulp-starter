/***************************************************************
 *    REQUIRE GULP and PLUGINS
 ***************************************************************/

var gulp = require('gulp'),                     //gulp.task(), gulp.src(), gilp.dest(), gulp.watch(), pipe()
    // JAVASCRIPT
    concat = require('gulp-concat'),            //concatena file JS
    uglify = require('gulp-uglify'),            //minimizza file JS

    //SASS
    postcss = require('gulp-postcss'),          //postcss per autoprefixer
    autoprefixer = require('autoprefixer'),     //autoprefixer (vendor prefixing for CSS)
    sass = require('gulp-sass'),                // SASS / SCSS compiler + minifier
    rename = require('gulp-rename'),            // Metodi per rinominare i files

    //BrowserSync
    browserSync = require('browser-sync');      // Browser auto-refresh



/***************************************************************
 *    JS TASKS
 ***************************************************************/

// JS MINIFICATION
gulp.task('uglify', function() {
  //ricorda diu escludere il file minificato .min.js
  return gulp.src(['./js/*.js', '!./js/*.min.js'])    //L'ordine di concatenazione: ['./js/script-one.js', './js/script-two.js', etc...]
        .pipe(concat('main.min.js'))                  //concatena
        .pipe(uglify())                               //minifica
        .pipe(gulp.dest('./js/'))                     //destinazione
        .pipe(browserSync.stream());                  //passa lo stream a BrowserSync
});



/***************************************************************
 *    SASS TASKS
 ***************************************************************/

// SASS COMPILING (task che sarà chiamata da 'autoprefixer')

var compDir = './sass/*.scss'; // <--((Change here to .scss or .sass syntax))

gulp.task('sass', function() {
  return gulp.src(compDir)                            //origine
        .pipe(sass({                                  //compilazione
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename('main.min.css'))                 //rinomina file compilato
        .pipe(gulp.dest('./css'));                    //destinazione
});

// AUTOPREFIXER (esegui prime la task 'sass')
gulp.task('autoprefixer', ['sass'], function() {
  return gulp.src('./css/*.css')                      //origine
        .pipe(postcss( [ autoprefixer() ] ))          //autoprefixer
        .pipe(gulp.dest('./css'))                     //destinazione
        .pipe(browserSync.stream());                  //passa lo stream a BrowserSync
});




/***************************************************************
 *    WATCH JS / SASS FILES ON SAVE -> 'gulp watch'
 ***************************************************************/

gulp.task('watch', function(){
  //sets browsersynch
  browserSync.init({
    server: "./",      //da dove servire i files del progetto (./ per la root)
    notify: false      //niente pop-up di notifica nel browser
  });

  gulp.watch(compDir, ['autoprefixer']);
  gulp.watch('./js/*.js', ['uglify']);
  gulp.watch("./*.html").on('change', browserSync.reload);  //ricarica per i file HTML
});



/***************************************************************
 *    START GULP WATCHING -> 'gulp'
 ***************************************************************/

gulp.task('default', ['watch']);
