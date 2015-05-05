var gulp = require('gulp'),
    react = require('gulp-react'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-minify-css'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "localhost:8000/app/"
    });
});

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src('./app/src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
 
gulp.task('build-js', function () {
    return gulp.src('./app/src/js/jsx/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('./app/src/js'));
});

gulp.task('browserify', function() {
    return browserify('./app/src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./app/src/js/build/'))
        .pipe(reload({stream: true}));
});

gulp.task('minify-js', function () {
    return gulp.src('./app/src/js/build/bundle.js')
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
    }))
    .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('build-css', function () {
    return gulp.src('./app/src/css/scss/main.scss')
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(rename({
            extname: '.min.css'
    }))
    .pipe(gulp.dest('./app/dist/css'))
    .pipe(reload({stream: true}));
});

gulp.task('minify-css', function() {
    return gulp.src('/app/src/css/main.css')
        .pipe(minifyCss())
        .pipe(rename({
         extname: '.min.css'
    }))
    .pipe(gulp.dest('./app/dist/css'));
});


// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('./app/src/js/jsx/*.jsx', ['build-js']);
    gulp.watch('./app/src/js/*.js', ['jshint']);
    gulp.watch('./app/src/js/*.js', ['browserify']);
    gulp.watch('./app/src/js/build/bundle.js', ['minify-js']);
    gulp.watch('./app/src/css/scss/main.scss', ['build-css']);
    gulp.watch('./app/src/css/main.css', ['minify-css']);
});


//need to add the react task to watch but not sure which files i need to do it for