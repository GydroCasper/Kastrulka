'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');

var paths = {
    js: 'dest/js',
    css: 'dest/css'
};

gulp.task('build-js-libs', function (){
    return gulp.src([
        '../node_modules/jquery/dist/jquery.min.js',
        '../node_modules/angular/angular.min.js',
        '../node_modules/angular-route/angular-route.min.js',
        '../node_modules/bootstrap/dist/js/bootstrap.min.js',
        '../node_modules/lodash/lodash.min.js',
        '../node_modules/bootbox/bootbox.min.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(paths.js));
});

gulp.task('build-js', function (){
    return gulp.src(['src/js/**/*.js', '!src/js/libs/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.js));
});

gulp.task('build-css-libs', function (){
    return gulp.src([
        '../node_modules/bootstrap/dist/css/**/*.css'
    ])
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(paths.css));
});

gulp.task('build-css', function (){
    return gulp.src(['src/css/**/*.css', '!src/css/libs/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(gulp.dest(paths.css));
});

gulp.task('clean', function (){
    return del([paths.js, paths.css]);
});

gulp.task('build', ['clean', 'build-js-libs', 'build-js', 'build-css-libs', 'build-css']);