#!/usr/bin/env node
const comParams = process.argv.slice(2);
var commands = {
    init:[],
    'init-vue':[]
};
var params;
comParams.forEach(function (param) {
    if(param in commands){
        params = commands[param];
    }else if (params){
        params.push(param);
    }
});

Object.keys(commands).forEach(function (key) {
    var ps = commands[key];
    if(ps.length > 0){
        require('./cmd.init.vue')(ps);
        return;
    }
});