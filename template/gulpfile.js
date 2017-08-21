const fs = require('fs');
const gulp = require('gulp');
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
var outputDirs = ['build','release'];
gulp.task('clean', function() {
    del(outputDirs);
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
gulp.task('dir-build', function () {
    outputDirs.forEach(function (dir) {
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    });
});
gulp.task('html-script', function () {


    var html = fs.readFileSync('src/index.html').toString();
    var scriptReg = /<script\s*src\s*=\s*"\s*(\S+)\s*"\s*>\s*<\/script>/ig;
    html = html.replace(scriptReg, function (all,src) {
        var index = src.lastIndexOf('/');
        if(index >= 0){
            src = src.slice(index + 1);
        }
        return '<script src="' + src + '"></script>';
    });
    fs.writeFileSync('build/template.html',html);
});
gulp.task('default', ['uglifyjs']);