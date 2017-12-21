const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const clone = require('clone');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const babel = require('gulp-babel');
var copy = require('gulp-copy');
var del = require('del');
var gulpMerge = require('merge-stream');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var htmlParser = require("htmlparser2");

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

function htmlScriptParseTasks(){
    var files = fs.readdirSync(paths.releaseDist).filter(function (file) {
        return !!file.match(/\.html?$/);
    });
    var scripts = [];
    files.forEach(function (file) {
        var filePath = path.resolve(paths.releaseDist,file);
        if(!fs.existsSync(filePath)){
            return;
        }
        var html = fs.readFileSync(filePath).toString();

        var jsReg = /\.js$/;
        var parser = new htmlParser.Parser({
            onopentag: function(name, attribs){
                var src = attribs.src;
                if(name.toLowerCase() === "script" && jsReg.test(src)){
                    let filePath = path.resolve(paths.releaseDist,src);
                    scripts.push(filePath);
                }
            }
        }, {decodeEntities: true});
        parser.write(html);
        parser.end();
    });
    return scripts;
}
function htmlLinkParseTasks(){
    var files = fs.readdirSync(paths.releaseDist).filter(function (file) {
        return !!file.match(/\.html?$/);
    });
    var links = [];
    files.forEach(function (file) {
        var filePath = path.resolve(paths.releaseDist,file);
        if(!fs.existsSync(filePath)){
            return;
        }
        var html = fs.readFileSync(filePath).toString();
        var cssReg = /\.css$/;
        var parser = new htmlParser.Parser({
            onopentag: function(name, attribs){
                var href = attribs.href;
                if(name.toLowerCase() === "link" && cssReg.test(href)){
                    links.push(path.resolve(paths.releaseDist,href));
                }
            }
        }, {decodeEntities: true});
        parser.write(html);
        parser.end();
    });
    return links;
}
var moduleDepResource = null;
function moduleDepScripts(){
    var resource = moduleDepResource || (moduleDepResource = extractJsCssResource());
    return resource.js;
}
function moduleDepCss(){
    var resource = moduleDepResource || (moduleDepResource = extractJsCssResource());
    return resource.css;
}
function extractJsCssResource(){
    var files = moduleParseTasks();
    var resource = extractFileUrl(null,files);
    return resource;
}
function extractFileUrl(root,files){

    var scriptReg = /(["'])\s*([^"']+\.js)\s*\1/g;
    var cssReg = /(["'])\s*([^"']+\.css)\s*\1/g;
    var cssUrls = [],
        jsUrls = [];

    function extractUrl(_root,urls,src){
        if(src.startsWith('/')){
            src = path.resolve(paths.releaseDist,src.replace(/^\/+/g,''));
        }else{
            src = path.resolve(_root,src);
        }
        urls.push(src);
        return src;
    }
    files.forEach(function (file) {

        if(!fs.existsSync(file)){
            return;
        }
        var content = fs.readFileSync(file).toString();
        content.replace(scriptReg, function (all,m1,src) {
            var _root = root || path.dirname(file);
            src = extractUrl(_root,jsUrls,src);
            var result = extractFileUrl(_root,[src]);
            cssUrls = cssUrls.concat(result.css);
            jsUrls = jsUrls.concat(result.js);
        });
        content.replace(cssReg, function (all,m1,src) {
            var _root = root || path.dirname(file);
            extractUrl(_root,cssUrls,src,file);
        });
    });
    return {
        js:jsUrls,
        css:cssUrls
    };
}
var configPath = path.resolve(paths.releaseDist,'env/applications.json');
function moduleParseTasks(){
    var config = require(configPath);
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
function gulpScriptGroups(resources){
    var minJsReg = /\.min.js$/;
    var streams = resources.filter(function (resource) {
        return !minJsReg.test(resource);
    }).map(function (resource) {
        return gulp.src([resource])
            .pipe(babel({
                presets: [[ "es2015", { modules: false } ]],
                plugins: []
            }))
            .pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }))
            .on('error', function (err) {
                console.error(err);
            })
            .pipe(gulp.dest(path.dirname(resource)));
    });
    return streams;
}
function gulpConcatDeclareScript(){
    var config = require(configPath);
    var files = moduleParseTasks();
    var _config = clone(config);
    _config.release = true;
    _config.main = '/declare.js';
    fs.writeFileSync(configPath,JSON.stringify(_config,null,4));
    var result =  gulp.src(files)
        .pipe(concat('declare.js'))
        .pipe(uglify({
            compress:{
                drop_console:true,
                unused:true,
                dead_code:true
            }
        }))
        .on('error', function (err) {
            console.error(err);
        })
        .pipe(gulp.dest(paths.releaseDist));
    return result;
}
function gulpCssGroups(resources){
    var streams = resources.map(function (resource) {
        return gulp.src([resource])
            .pipe(cleanCSS())
            .on('error', function (err) {
                console.error(err);
            })
            .pipe(gulp.dest(path.dirname(resource)));
    });
    return gulpMerge(streams);
}
gulp.task('minDeclareScript',['copyRelease'], function () {
    var resources = htmlScriptParseTasks();
    var streams = gulpScriptGroups(resources.concat(moduleParseTasks()));
    return gulpMerge(streams);
});
gulp.task('concatScripts',['minDeclareScript'], function () {
    var config = require(configPath);
    if(config.concat){
        var result = gulpConcatDeclareScript();
        return result;
    }
});
gulp.task('minScript',['concatScripts'], function () {
    var streams = gulpScriptGroups(moduleDepScripts());
    var result =  gulpMerge(streams);
    return result;
});
gulp.task('minCss',['minScript'], function () {
    var resources = htmlLinkParseTasks().concat(moduleDepCss());
    return gulpCssGroups(resources);
});
gulp.task('buildRelease',['minScript','minCss'], function () {
    return del([paths.buildDist]);
});
gulp.task('buildReleaseNoDel',['minScript','minCss']);

gulp.task('clean',['cleanDev','cleanRelease']);
gulp.task('build',['buildDev','buildReleaseNoDel']);

