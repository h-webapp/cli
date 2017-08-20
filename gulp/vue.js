var gulp = require('gulp');
var copy = require('gulp-copy');
var del = require('del');
var paths = {
    copyFiles:['src/**/!(*min.js|*.scss|*.less)'],
    scripts: ['build/**/*.js','!build/vendor/**'],
    dest:'build/'
};
var currentDir = process.cwd();
gulp.task('clean', function() {
    return del([paths.dest]);
});
gulp.task('copyOthers',['clean'], function () {
    return gulp.src(paths.copyFiles)
        .pipe(gulp.dest(paths.dest));
});
gulp.task('default', ['copyOthers']);