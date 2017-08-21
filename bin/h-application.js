#!/usr/bin/env node
const comParams = process.argv.slice(2);
var commands = {
    '--type':[],
    '--name':[]
};
var params;
comParams.some(function (param) {
    if(param in commands){
        params = commands[param];
    }else if (params){
        params.push(param);
    }
});

require('./init-template')(commands);