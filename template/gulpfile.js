const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var del = require('del');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
const dirName = __dirname;
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
gulp.task('html-script',['dir-build'], function () {


    var html = fs.readFileSync('src/index.html').toString();
    var scriptReg = /<script\s*src\s*=\s*"\s*(\S+)\s*"\s*>\s*<\/script>/ig;
    html = html.replace(scriptReg, function (all,src) {
        var _src = path.resolve(dirName,src);
        _src = path.relative(dirName,_src);

        return '<script src="' + _src + '"></script>';
    });
    fs.writeFileSync('build/index.html',html);
});
gulp.task('default', ['uglifyjs']);