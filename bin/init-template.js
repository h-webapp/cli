const path = require('path');
var fileOption = {
    react:'./react.js',
    vue:'./vue.js'
};
var distDir = process.cwd();

module.exports = function (cmdOption) {

    var type = cmdOption['--type'][0] || 'vue';
    var projectName = cmdOption['--name'][0];
    if(!projectName){
        console.error('please input a invalid project dir name,eg: --name test !');
        return;
    }

    if(!fileOption.hasOwnProperty(type)){
        console.error('invalid type !,supported types: vue');
        return;
    }
    require(fileOption[type])(path.resolve(distDir,projectName));
};
