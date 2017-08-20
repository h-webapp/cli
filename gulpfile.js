var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var del = require('del');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var paths = {
    copyFiles:['src/**/!(*min.js|*.scss|*.less)'],
    scripts: ['build/**/*.js','!build/vendor/**'],
    dest:'build/'
};

gulp.task('clean', function() {
    return del([paths.dest]);
});
gulp.task('copyOthers',['clean'], function () {
    return gulp.src(paths.copyFiles)
        .pipe(gulp.dest(paths.dest));
});
gulp.task('uglifyjs',['copyOthers'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest));
});
gulp.task('default', ['uglifyjs']);