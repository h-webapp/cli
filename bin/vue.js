'use strict';
const copy = require('./copy');
const path = require('path');
module.exports = function(dist){
    copy(path.resolve(__dirname,'../vue-template'),dist);
}