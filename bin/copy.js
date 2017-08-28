'use strict';
const fs = require('fs');
const path = require('path');
function copy(source,target,dist){
    if(!fs.existsSync(source)){
        return;
    }
    if(!fs.existsSync(dist)){
        fs.mkdirSync(dist);
    }else if(!fs.statSync(dist).isDirectory()){
        throw new Error(dist + ' is not a directory !');
    }
    var stat = fs.statSync(target);
    if(stat.isFile()){
        let output = path.resolve(dist,path.relative(source,target));
        let buffer = fs.readFileSync(target);
        fs.writeFileSync(output,buffer);
    }else if(stat.isDirectory()){
        let items = fs.readdirSync(target);
        let curDir = path.resolve(dist,path.relative(source,target));
        if(!fs.existsSync(curDir)){
            fs.mkdirSync(curDir);
        }
        items.forEach(function (item) {
            copy(source,path.resolve(target,item),dist);
        });
    }
}
module.exports = function (source,dist) {
    copy(source,source,dist);
};