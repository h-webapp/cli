const path = require('path');
const childProcess = require('child_process');
var projectDir = path.dirname(__dirname);
var gulpFiles = {
    react:path.resolve(__dirname,'react-gulpfile.js'),
    vue:path.resolve(__dirname,'vue-gulpfile.js')
};
var distDir = process.cwd();

module.exports = function (cmdOption) {

    var type = cmdOption['--type'][0] || 'vue';
    var projectName = cmdOption['--name'][0];
    if(!projectName){
        throw new Error('please input a invalid project dir name,eg:--name test !');
    }

    var commands = ['gulp'];
    commands.push('--cwd');
    commands.push(projectDir);
    commands.push('--gulpfile');


    commands.push(gulpFiles[type]);


    commands.push('--distDir');
    commands.push(path.resolve(distDir,projectName));

    childProcess.execSync(commands.join(' '));
};
