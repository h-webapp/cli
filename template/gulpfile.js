const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var del = require('del');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    copyFiles:['src/**/!(*min.js|*.scss|*.less)'],
    scripts: ['release/**/*.js','release/!(node_modules|vendor)/**/*'],
    buildDist:'develop',
    releaseDist:'release'
};
paths.depDist = paths.buildDist + '/node_modules';

var dependencies = Object.keys(require('./package.json').dependencies);

const taskName = (function(){
    var taskId = 1;
    return function () {
        return 'customTask_' + taskId++;
    }
})();

// build tasks
var depTasks = [];
dependencies.forEach(function (dep) {
    var tName = taskName();
    gulp.task(tName, function () {
        return gulp.src(['node_modules/' + dep + '/**/*'])
            .pipe(gulp.dest(paths.depDist + '/' + dep));
    });
    depTasks.push(tName);
});


gulp.task('cleanDev', function() {
    del([paths.buildDist]);
});

gulp.task('copyDev', function () {
    return gulp.src(paths.copyFiles)
        .pipe(gulp.dest(paths.buildDist));
});
gulp.task('copyAllDev',['copyDev'].concat(depTasks));

gulp.task('buildDev',['copyAllDev']);


// release tasks
gulp.task('cleanRelease', function() {
    del([paths.releaseDist]);
});
gulp.task('copyRelease',['buildDev'], function () {
    return gulp.src([paths.buildDist + '/**/*'])
        .pipe(gulp.dest(paths.releaseDist));
});

gulp.task('minScript',['copyRelease'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.releaseDist));
});

gulp.task('buildRelease',['minScript'], function () {

});
gulp.task('clean',['cleanDev','cleanRelease']);
gulp.task('build',['buildDev','buildRelease'])
gulp.task('default', ['buildRelease']);