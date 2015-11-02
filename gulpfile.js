var gulp = require('gulp');

var changed = require('gulp-changed'),
    jshint = require ('gulp-jshint'),
    concat = require ('gulp-concat'),
    uglify = require ('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require ('gulp-imagemin'),
    clean = require('gulp-clean'),
    autoprefixer = require ('gulp-autoprefixer'),
    minifyCSS = require ('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['images', 'build-js', 'build-css', 'watch', 'jshint']);


// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Compress images
gulp.task('images', function() {
    var imgSrc = './icon/**/*',
        imgDst = './dist/icon';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// Script task
gulp.task('build-js', function() {
    gulp.src('js/*')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

// CSS task
gulp.task('build-css', function() {
    gulp.src('css/**/*')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('js/*.js', ['build-js']);
    gulp.watch('css/**.css', ['build-css']);
    gulp.watch('icon/**', ['images']);
    gulp.watch('js/*.js', ['jshint']);
});
