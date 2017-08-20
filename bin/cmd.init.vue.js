const childProcess = require('child_process');
function initProject(params){
    if(params.length === 0){
        throw new Error('please input valid project name !');
    }
    var commands = [];
    commands.push('git');
    commands.push('clone');
    commands.push('git@github.com:kouyjes/web-application.git');
    commands.push(params[0]);
    console.log('stating init project with name : ' + params[0]);
    var child = childProcess.exec(commands.join(' '));
    child.on('close', () => {
        require('fs').unlink('./' + params[0] + '/.git');
    });
}
module.exports = initProject;