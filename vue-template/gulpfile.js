const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var del = require('del');
var gulpMerge = require('merge-stream');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    copyFiles:['src/**/*'],
    buildDist:'develop',
    releaseDist:'release'
};
paths.depDist = paths.buildDist + '/node_modules';
paths.releaseCopyFiles = [paths.buildDist + '/**/!(*.scss|*.sass|*.less|*.map|*.ts)'];

var dependencies = Object.keys(require('./package.json').dependencies);

const taskName = (function(){
    var taskId = 1;
    return function () {
        return 'customTask_' + taskId++;
    }
})();

// build tasks

gulp.task('cleanDev', function() {
    del([paths.buildDist]);
});

gulp.task('copyDev', function () {
    var streams = dependencies.map(function (dep) {
        return gulp.src(['node_modules/' + dep + '/**/*'])
            .pipe(gulp.dest(paths.depDist + '/' + dep));
    });
    streams.push(gulp.src(paths.copyFiles)
        .pipe(gulp.dest(paths.buildDist)));
    return gulpMerge(streams);
});

gulp.task('buildDev',['copyDev']);


// release tasks
gulp.task('cleanRelease', function() {
    del([paths.releaseDist]);
});
gulp.task('copyRelease',['buildDev'], function () {
    return gulp.src(paths.releaseCopyFiles)
        .pipe(gulp.dest(paths.releaseDist));
});

function htmlParseTasks(){
    var files = fs.readdirSync(paths.releaseDist).filter(function (file) {
        return !!file.match(/\.html?$/);
    });
    var scriptReg = /<script\s*src\s*=\s*"\s*([^"]+)\s*"\s*>\s*<\/script>/g;
    var scripts = [];
    files.forEach(function (file) {
        var filePath = path.resolve(paths.releaseDist,file);
        if(!fs.existsSync(filePath)){
            return;
        }
        var html = fs.readFileSync(filePath).toString();
        html.replace(scriptReg, function (all,script) {
            scripts.push(path.resolve(paths.releaseDist,script));
        });
    });
    return scripts;
}
function moduleDepScripts(){
    var files = moduleParseTasks();
    var scriptReg = /(["'])\s*([^"']+\.js)\s*\1/g;
    var depScripts = [];

    files.forEach(function (file) {

        if(!fs.existsSync(file)){
            return;
        }
        var content = fs.readFileSync(file).toString();
        content.replace(scriptReg, function (all,m1,src) {
            if(src.startsWith('/')){
                depScripts.push(path.resolve(paths.releaseDist,src.replace(/^\/+/g,'')));
            }else{
                depScripts.push(path.resolve(path.dirname(file),src));
            }
        });
    });
    return depScripts;
}
function moduleParseTasks(){

    var config = require(path.resolve(paths.releaseDist,'env/applications.json'));
    var apps = config.apps || [],
        modules = config.modules || [],
        main = config.main;
    var files = apps.concat(modules).map(function (app) {
        return path.resolve(paths.releaseDist, app.url);
    });
    if(main){
        files.push(path.resolve(paths.releaseDist,main));
    }
    return files;
}
function gulpGroups(resources){
    var streams = resources.map(function (resource) {
        return gulp.src([resource])
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .on('error', function (err) {
                console.error(err);
            })
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.dirname(resource)));
    });
    return gulpMerge(streams);
}
gulp.task('minDeclareScript',['copyRelease'], function () {
    var resources = htmlParseTasks().concat(moduleParseTasks());
    return gulpGroups(resources);
});
gulp.task('minScript',['minDeclareScript'], function () {
    return gulpGroups(moduleDepScripts());
});

gulp.task('buildRelease',['minScript'], function () {
    return del([paths.buildDist]);
});
gulp.task('buildReleaseNoDel',['minScript']);

gulp.task('clean',['cleanDev','cleanRelease']);
gulp.task('build',['buildDev','buildReleaseNoDel']);