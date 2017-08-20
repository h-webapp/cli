const childProcess = require('child_process');
const path = require('path');
var _process = null;
function reStartServer(){
    if(_process){
        _process.kill("SIGINT");
    }
    _process = childProcess.fork('./server/server');
}
reStartServer();
var dirName = path.resolve(__dirname,'../mock');
const watch = require('watch');
watch.watchTree(dirName, function () {
    console.log(reStartServer);
    reStartServer();
});
