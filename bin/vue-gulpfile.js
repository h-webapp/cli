var gulp = require('gulp');
var copy = require('gulp-copy');
var distDir = process.argv[process.argv.length - 1];
var paths = {
    files: ['./vue-template/**/*'],
    dist: distDir
};

gulp.task('copy', function () {
    return gulp.src(paths.files)
        .pipe(gulp.dest(paths.dist));
});
gulp.task('default',['copy'],function () {

});